import Image from "next/image";

import { cn } from "@/lib/utils";
import { getCurrencyFlagUrl } from "@/services/currency-flags.service";
import type { CurrencyFlagProps } from "@/types/ui.types";
import { Skeleton } from "../ui/skeleton";

export function CurrencyFlag({
  currencyCode,
  isLoading,
  size = 24,
}: CurrencyFlagProps) {
  const flagUrl = getCurrencyFlagUrl(currencyCode);

  if (isLoading) {
    return (
      <Skeleton
        className="bg-neutral-400 rounded-full"
        style={{ width: size, height: size }}
      />
    );
  }

  if (!flagUrl) {
    // No flag asset for some currency — render a neutral
    // placeholder instead of a broken image.
    return (
      <span
        aria-hidden="true"
        className="inline-block shrink-0 bg-neutral-400 rounded-full"
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
