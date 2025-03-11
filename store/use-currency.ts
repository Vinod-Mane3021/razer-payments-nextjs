import { detectUserCurrency } from "@/lib/billing";
import { create } from "zustand";
import { persist } from "zustand/middleware";


type EdgeStoreType = {
  currency: string;
  setCurrency: (currency: string) => void;
  initializeCurrency: () => Promise<void>;
};

export const useCurrency = create<EdgeStoreType>()(
  persist(
    (set) => ({
      currency: "USD", // Default value before detection
      setCurrency: (currency) => set({ currency }),
      initializeCurrency: async () => {
        const detectedCurrency = await detectUserCurrency();
        set({ currency: detectedCurrency });
      },
    }),
    {
      name: "user_currency",
      partialize: (state) => ({ currency: state.currency }),
    },
  )
);
