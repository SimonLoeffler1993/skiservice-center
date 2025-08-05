"use client"

import { SaisonpreisContextProvider } from "@/context/saisonpreis-contex";
import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
import { SkikundenContextProvider } from "@/context/skikunden-context";
import { getSaisonVerleihPreis } from "@/lib/saisonverleih";

export default function SaisonverleihErstellenLayout({ children }: { children: React.ReactNode }) {
  const saisonpreisePromise = getSaisonVerleihPreis();
  return (
    <SaisonpreisContextProvider saisonpreisePromise={saisonpreisePromise}>
    <SkikundenContextProvider>
      <SaisonverleihContextProvider>
        {children}
      </SaisonverleihContextProvider>
    </SkikundenContextProvider>
    </SaisonpreisContextProvider>
  );
}