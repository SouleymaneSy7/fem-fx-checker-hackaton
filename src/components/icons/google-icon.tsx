import type * as React from "react";

export function GoogleSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon — accessibility handled by parent Icon component via aria-hidden or aria-label
    <svg
      viewBox="0 0 20 20"
      fill="none"
      width={20}
      height={20}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.964 4.965c1.23 0 2.33.424 3.198 1.25l2.379-2.378c-1.445-1.344-3.33-2.17-5.577-2.17a8.33 8.33 0 0 0-7.444 4.59l2.77 2.15c.657-1.976 2.5-3.442 4.674-3.442M17.944 10.191c0-.545-.053-1.073-.132-1.58H9.964v3.132h4.493a3.87 3.87 0 0 1-1.66 2.493l2.685 2.084c1.566-1.452 2.462-3.598 2.462-6.129M5.288 11.594A5 5 0 0 1 5.024 10c0-.555.093-1.09.264-1.593l-2.771-2.15A8.3 8.3 0 0 0 1.63 10c0 1.348.32 2.618.89 3.743z"
      />
      <path
        fill="currentColor"
        d="M9.965 18.333c2.25 0 4.142-.74 5.517-2.017l-2.684-2.083c-.747.503-1.709.798-2.834.798-2.173 0-4.017-1.465-4.677-3.44l-2.77 2.149a8.34 8.34 0 0 0 7.447 4.593"
      />
    </svg>
  );
}
