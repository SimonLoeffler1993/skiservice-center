import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
import { SkikundenContextProvider } from "@/context/skikunden-context";
import { getSaisonVerleihPreis } from "@/lib/saisonverleihactions";
import { SaisonpreisContextProvider } from "@/context/saisonpreis-contex";


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