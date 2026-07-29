import { create } from "zustand";
import {
  DEFAULT_AMOUNT,
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
} from "@/constants";
import type { ConverterStoreType } from "@/types";

export const useConverterStore = create<ConverterStoreType>((set) => ({
  amount: DEFAULT_AMOUNT,
  fromCurrency: DEFAULT_FROM_CURRENCY,
  toCurrency: DEFAULT_TO_CURRENCY,

  setAmount: (amount) => set({ amount }),
  setFromCurrency: (code) => set({ fromCurrency: code }),
  setToCurrency: (code) => set({ toCurrency: code }),
  swapCurrencies: () =>
    set((state) => ({
      fromCurrency: state.toCurrency,
      toCurrency: state.fromCurrency,
    })),
}));
