import { SaisonverleihContextProvider } from "@/context/saisonverleih-context";
import { getSaisonVerleihPreis } from "@/lib/saisonverleihactions";
import { SaisonpreisContextProvider } from "@/context/saisonpreis-contex";


import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { skiStoeckeOptions } from "@/hooks/useSchuhMaterialOptions";

export default async function SaisonverleihErstellenLayout({ children }: { children: React.ReactNode }) {
    const saisonpreisePromise = getSaisonVerleihPreis();
    // const skistoeckePromise = getSkiStoecke();
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(skiStoeckeOptions);


    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />
            <SaisonpreisContextProvider saisonpreisePromise={saisonpreisePromise}>
                <SaisonverleihContextProvider>
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        {children}
                    </HydrationBoundary>
                </SaisonverleihContextProvider>
            </SaisonpreisContextProvider>
        </div>
    );
}