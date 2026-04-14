export const dynamic = 'force-dynamic';
// Cache ausschalten, da sich die Daten ändern

import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";

// import { getSaisons } from "@/lib/saisonactions";
// import { SaisonContextProvider } from "@/context/saison-context";

type SaisonVerleiAnzeigeLayoutProps = {
    children: React.ReactNode;
}

export default function SaisonVerleiAnzeigeLayout({ children }: SaisonVerleiAnzeigeLayoutProps) {
  
    // const saisonPromise = getSaisons();
    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />
            {/* <SaisonContextProvider saisonPromise={saisonPromise}> */}
                    {children}
            {/* </SaisonContextProvider> */}
        </div>
    );
}