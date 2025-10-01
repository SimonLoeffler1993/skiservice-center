import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";
import { SaisonverleihlisteContextProvider } from "@/context/saisonverleihliste-context";
import { getSaisonVerleihList } from "@/lib/saisonverleihactions";

type SaisonVerleiAnzeigeLayoutProps = {
    children: React.ReactNode;
}

export default function SaisonVerleiAnzeigeLayout({ children }: SaisonVerleiAnzeigeLayoutProps) {
    const saisonverleihlistePromise = getSaisonVerleihList();
    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />
            <SaisonverleihlisteContextProvider saisonverleihlistePromise={saisonverleihlistePromise}>
                {children}
            </SaisonverleihlisteContextProvider>
        </div>
    );
}