export const dynamic = 'force-dynamic';
// Cache ausschalten, da sich die Daten ändern

import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";


type SaisonVerleiAnzeigeLayoutProps = {
    children: React.ReactNode;
}

export default function SaisonVerleiAnzeigeLayout({ children }: SaisonVerleiAnzeigeLayoutProps) {
  
    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />
                    {children}
        </div>
    );
}