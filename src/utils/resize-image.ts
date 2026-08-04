import { AVATAR_JPEG_QUALITY, AVATAR_MAX_DIMENSION } from "@/constants";

// Downscales and re-encodes an uploaded image entirely in the browser —
// no upload service, no server round-trip. The result is a JPEG data URI
// small enough to store directly in Better Auth's `user.image` column (a
// plain text field, no dedicated blob storage in this project).
export function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () =>
      reject(new Error("Couldn't read the selected file."));

    reader.onload = () => {
      const image = new Image();

      image.onerror = () =>
        reject(new Error("Couldn't load the selected image."));

      image.onload = () => {
        const scale = Math.min(
          1,
          AVATAR_MAX_DIMENSION / Math.max(image.width, image.height),
        );
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Canvas isn't supported in this browser."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", AVATAR_JPEG_QUALITY));
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
