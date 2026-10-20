// Dynamisch rendern, damit Art und Zeitraum aus der URL schon auf dem Server gelesen werden
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
// import { getSaisonVerleihPreis } from "@/lib/saisonverleihactions";
// import { SaisonpreisContextProvider } from "@/context/saisonpreis-contex";


import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { skiStoeckeOptions } from "@/hooks/useSchuhMaterialOptions";
import { saisonverleihPreiseOptions } from "@/hooks/useSaisonverleihPreiseOptions";

export default async function SaisonverleihErstellenLayout({ children }: { children: React.ReactNode }) {

    // const skistoeckePromise = getSkiStoecke();

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery(skiStoeckeOptions),
        queryClient.prefetchQuery(saisonverleihPreiseOptions)

    ]);


    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />
            {/* <SaisonpreisContextProvider saisonpreisePromise={saisonpreisePromise}> */}
                {/* Suspense wegen useSearchParams im Context */}
                <Suspense fallback={<p>Lade...</p>}>
                    {/* Art und Zeitraum kommen aus der URL, z.B. ?art=tag&von=2026-01-10&bis=2026-01-12 */}
                    <SaisonverleihContextProvider artAusUrl>
                        <HydrationBoundary state={dehydrate(queryClient)}>
                            {children}
                        </HydrationBoundary>
                    </SaisonverleihContextProvider>
                </Suspense>
            {/* </SaisonpreisContextProvider> */}
        </div>
    );
}