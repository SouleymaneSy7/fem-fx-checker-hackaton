import type { ConverterSearchParamsType } from "@/types";

export function buildConverterSearchParams({
  from,
  to,
  amount,
}: ConverterSearchParamsType): URLSearchParams {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);
  params.set("amount", String(amount));

  return params;
}
