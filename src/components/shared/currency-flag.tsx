import Image from "next/image";

import { cn } from "@/lib/utils";
import { getCurrencyFlagUrl } from "@/services/currency-flags.service";
import type { CurrencyFlagProps } from "@/types/ui.types";

export function CurrencyFlag({ currencyCode, size = 24 }: CurrencyFlagProps) {
  const flagUrl = getCurrencyFlagUrl(currencyCode);

  if (!flagUrl) {
    // No flag asset for some currency — render a neutral
    // placeholder instead of a broken image.
    return (
      <span
        aria-hidden="true"
        className="inline-block shrink-0 bg-neutral-500 rounded-full"
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
        src={flagUrl}
        alt=""
        width={size}
        height={size}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}
