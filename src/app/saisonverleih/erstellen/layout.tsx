import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
import { SkikundenContextProvider } from "@/context/skikunden-context";
import { getSaisonVerleihPreis } from "@/lib/saisonverleihactions";
import { SaisonpreisContextProvider } from "@/context/saisonpreis-contex";

import { SkimaterialContextProvider } from "@/context/skimaterial-contex";
import { getSkiStoecke } from "@/lib/materialactions";

export default function SaisonverleihErstellenLayout({ children }: { children: React.ReactNode }) {
    const saisonpreisePromise = getSaisonVerleihPreis();
    const skistoeckePromise = getSkiStoecke();

    return (
        <SaisonpreisContextProvider saisonpreisePromise={saisonpreisePromise}>
            <SkimaterialContextProvider skistoeckePromise={skistoeckePromise}>
                <SkikundenContextProvider>
                    <SaisonverleihContextProvider>
                        {children}
                    </SaisonverleihContextProvider>
                </SkikundenContextProvider>
            </SkimaterialContextProvider>
        </SaisonpreisContextProvider>

    );
}