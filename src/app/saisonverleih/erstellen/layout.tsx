"use client";

import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
import { SkikundenContextProvider } from "@/context/skikunden-context";

export default function SaisonverleihErstellenLayout({ children }: { children: React.ReactNode }) {
  return (
    <SkikundenContextProvider>
      <SaisonverleihContextProvider>
        {children}
      </SaisonverleihContextProvider>
    </SkikundenContextProvider>
  );
}