"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import {
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
  URL_SYNC_DEBOUNCE_MS,
} from "@/constants";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useConverterStore } from "@/store/converter-store";
import { buildConverterSearchParams } from "@/utils/converter-search-params";
import { converterSearchParamsSchema } from "@/validators";

// Picks a `to` that never collides with `from`. If the candidate already
// matches, falls back to whichever default currency isn't `from` — same
// resolution regardless of which side (from-only, to-only, or both) is
// what produced the collision.
function resolveNonCollidingTo(from: string, candidateTo: string): string {
  if (candidateTo !== from) return candidateTo;
  return from === DEFAULT_TO_CURRENCY
    ? DEFAULT_FROM_CURRENCY
    : DEFAULT_TO_CURRENCY;
}

function ConverterUrlSyncInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const amount = useConverterStore((state) => state.amount);
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);
  const setAmount = useConverterStore((state) => state.setAmount);
  const setFromCurrency = useConverterStore((state) => state.setFromCurrency);
  const setToCurrency = useConverterStore((state) => state.setToCurrency);

  const hasHydrated = React.useRef(false);

  // Hydrate the store from a shared link exactly once, before the first
  // paint — a plain `useEffect` here would flash the default USD/EUR/1000
  // state for a frame before the URL's values took over.
  useIsomorphicLayoutEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const parsed = converterSearchParamsSchema.parse({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
      amount: searchParams.get("amount"),
    });

    const hasFrom = searchParams.has("from");
    const hasTo = searchParams.has("to");

    const resolvedFrom = hasFrom ? parsed.from : fromCurrency;

    // Falls back to the current `to` when the URL doesn't specify one,
    // then nudges away to the other default whenever it would collide
    // with `resolvedFrom` — covers a to-only link, a from-only link, and
    // a link where both sides accidentally (or deliberately) encode the
    // same pair.
    const pendingTo = hasTo ? parsed.to : toCurrency;
    const resolvedTo = resolveNonCollidingTo(resolvedFrom, pendingTo);

    if (hasFrom) setFromCurrency(resolvedFrom);
    if (resolvedTo !== toCurrency) setToCurrency(resolvedTo);

    if (searchParams.has("amount")) setAmount(parsed.amount);
  }, []);

  // Reflect the live converter state back into the URL so the address bar
  // always matches what's on screen and can be copied to share. The write
  // itself is debounced (a `setTimeout` cleared on every change), not the
  // values it reads — so a shared link's amount lands correctly right
  // away instead of trailing a separately-debounced copy of `amount`.
  React.useEffect(() => {
    if (!hasHydrated.current) return;

    const timeoutId = setTimeout(() => {
      const params = buildConverterSearchParams({
        from: fromCurrency,
        to: toCurrency,
        amount,
      });

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, URL_SYNC_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [fromCurrency, toCurrency, amount, pathname, router]);

  return null;
}

// `useSearchParams()` always requires a Suspense boundary, or Next.js
// forces the whole route into fully dynamic rendering. Wrapping it here
// keeps that cost contained to this one invisible component.
const ConverterUrlSync = () => {
  return (
    <React.Suspense fallback={null}>
      <ConverterUrlSyncInner />
    </React.Suspense>
  );
};

export default ConverterUrlSync;
