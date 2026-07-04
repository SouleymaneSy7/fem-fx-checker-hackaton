import { create } from "zustand";
import type { ConverterStoreType } from "@/types/data.types";

export const useConverterStore = create<ConverterStoreType>((set) => ({
  amount: 1000,
  fromCurrency: "USD",
  toCurrency: "EUR",

  setAmount: (amount) => set({ amount }),
  setFromCurrency: (code) => set({ fromCurrency: code }),
  setToCurrency: (code) => set({ toCurrency: code }),
  swapCurrencies: () =>
    set((state) => ({
      fromCurrency: state.toCurrency,
      toCurrency: state.fromCurrency,
    })),
}));
