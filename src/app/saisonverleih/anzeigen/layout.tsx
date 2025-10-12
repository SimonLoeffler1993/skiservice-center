import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";
import { SaisonverleihlisteContextProvider } from "@/context/saisonverleihliste-context";
import { getSaisonVerleihList } from "@/lib/saisonverleihactions";
import { getSaisons } from "@/lib/saisonactions";
import { SaisonContextProvider } from "@/context/saison-context";

type SaisonVerleiAnzeigeLayoutProps = {
    children: React.ReactNode;
}

export default function SaisonVerleiAnzeigeLayout({ children }: SaisonVerleiAnzeigeLayoutProps) {
    const saisonverleihlistePromise = getSaisonVerleihList();
    const saisonPromise = getSaisons();
    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />
            <SaisonContextProvider saisonPromise={saisonPromise}>
                <SaisonverleihlisteContextProvider saisonverleihlistePromise={saisonverleihlistePromise}>
                    {children}
                </SaisonverleihlisteContextProvider>
            </SaisonContextProvider>
        </div>
    );
}