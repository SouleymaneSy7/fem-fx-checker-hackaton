import type * as React from "react";

export function ChevronDownSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon — accessibility handled by parent Icon component via aria-hidden or aria-label
    <svg
      viewBox="0 0 12 12"
      fill="none"
      width={12}
      height={12}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2.988 4.02h6.024c.422 0 .633.515.328.82l-3 3a.48.48 0 0 1-.68 0l-3-3c-.304-.305-.093-.82.328-.82"
      />
    </svg>
  );
}
