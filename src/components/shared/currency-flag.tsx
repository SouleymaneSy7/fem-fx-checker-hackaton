import Image from "next/image";

import { cn } from "@/lib/utils";
import { getCurrencyFlagPath } from "@/utils/currency-flags";

export type CurrencyFlagProps = {
  currencyCode: string;
  size?: number;
};

export function CurrencyFlag({ currencyCode, size = 20 }: CurrencyFlagProps) {
  const flagPath = getCurrencyFlagPath(currencyCode);

  if (!flagPath) {
    // No flag asset for some currency (e.g. ILS) — render a neutral
    // placeholder instead of a broken image.
    return (
      <span
        aria-hidden="true"
        className="inline-block shrink-0 rounded-full bg-neutral-500"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full",
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={flagPath}
        alt=""
        width={size}
        height={size}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
  );
}
