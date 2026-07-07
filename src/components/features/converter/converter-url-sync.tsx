"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useConverterStore } from "@/store/converter-store";
import {
  buildConverterSearchParams,
  converterSearchParamsSchema,
} from "@/utils/converter-search-params";

// URL writes are debounced so typing in the amount field doesn't call
// history.replaceState on every keystroke.
const URL_SYNC_DEBOUNCE_MS = 500;

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
  // biome-ignore lint/correctness/useExhaustiveDependencies: must run once, against the URL the page loaded with — re-running on searchParams would undo whatever the user has changed since.
  useIsomorphicLayoutEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const parsed = converterSearchParamsSchema.parse({
      from: searchParams.get("from"),
      to: searchParams.get("to"),
      amount: searchParams.get("amount"),
    });

    if (searchParams.has("from")) setFromCurrency(parsed.from);

    // Never let a same/same pair through, even if that's what the link
    // (accidentally or deliberately) encodes.
    if (searchParams.has("to") && parsed.to !== parsed.from) {
      setToCurrency(parsed.to);
    }

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
