import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
import { SkikundenContextProvider } from "@/context/skikunden-context";
import { getSaisonVerleihPreis } from "@/lib/saisonverleihactions";
import { SaisonpreisContextProvider } from "@/context/saisonpreis-contex";

import { SkimaterialContextProvider } from "@/context/skimaterial-contex";
import { getSkiStoecke } from "@/lib/materialactions";
import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";

export default function SaisonverleihErstellenLayout({ children }: { children: React.ReactNode }) {
    const saisonpreisePromise = getSaisonVerleihPreis();
    const skistoeckePromise = getSkiStoecke();

    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />
            <SaisonpreisContextProvider saisonpreisePromise={saisonpreisePromise}>
                <SkimaterialContextProvider skistoeckePromise={skistoeckePromise}>
                    <SkikundenContextProvider>
                        <SaisonverleihContextProvider>
                            {children}
                        </SaisonverleihContextProvider>
                    </SkikundenContextProvider>
                </SkimaterialContextProvider>
            </SaisonpreisContextProvider>
        </div>
    );
}