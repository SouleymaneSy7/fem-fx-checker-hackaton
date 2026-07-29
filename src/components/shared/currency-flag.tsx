import Image from "next/image";

import { cn } from "@/lib/utils";
import { getCurrencyFlagUrl } from "@/services";
import type { CurrencyFlagProps } from "@/types";
import { Skeleton } from "../ui";

export function CurrencyFlag({
  currencyCode,
  isLoading,
  size = 24,
}: CurrencyFlagProps) {
  const flagUrl = getCurrencyFlagUrl(currencyCode);

  if (isLoading) {
    return (
      <Skeleton
        className="rounded-full bg-neutral-400"
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
        className="inline-block shrink-0 rounded-full bg-neutral-400"
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
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
}
