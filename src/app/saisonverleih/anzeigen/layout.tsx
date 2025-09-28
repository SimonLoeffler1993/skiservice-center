import { SaisonverleihlisteContextProvider } from "@/context/saisonverleihliste-context";
import { getSaisonVerleihList } from "@/lib/saisonverleihactions";

type SaisonVerleiAnzeigeLayoutProps = {
    children: React.ReactNode;
}

export default function SaisonVerleiAnzeigeLayout({ children }: SaisonVerleiAnzeigeLayoutProps) {
    const saisonverleihlistePromise = getSaisonVerleihList();
    return (
        <SaisonverleihlisteContextProvider saisonverleihlistePromise={saisonverleihlistePromise}>
            {children}
        </SaisonverleihlisteContextProvider>
    );
}