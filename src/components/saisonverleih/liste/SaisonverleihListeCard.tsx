import { Card } from "@/components/ui/card";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import { User } from "lucide-react";
import SaisonverleihCardBezahlt from "./SaisonverleihCardBezahlt";
import SaisonverleihCardStatus from "./SaisonverleihCardStatus";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


type SaisonverleihListeCardProps = {
    saisonverleih: SaisonverleihRead;
}

export default function SaisonverleihListeCard({ saisonverleih }: SaisonverleihListeCardProps) {
    const router = useRouter();
    return (
        <Card>
            <div className="p-3">
                <p>{saisonverleih.Name}</p>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <div className="text-base font-semibold leading-tight flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {saisonverleih.Kunde.Nachname}, {saisonverleih.Kunde.Vorname}
                        </div>
                        {/* TODO zusammenfassung anzahl ski, schuh, stock */}
                        <div className="text-xs text-muted-foreground">Ausrüstung #{saisonverleih.ID}</div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <SaisonverleihCardBezahlt bezahlt={saisonverleih.Bezahlt} />
                        <SaisonverleihCardStatus status={saisonverleih.Zurueck} />
                    </div>
                </div>
                <div className="flex justify-end p-2">
                    <Button variant="outline" onClick={() => { router.push(`/saisonverleih/anzeigen/${saisonverleih.ID}`) }}>Details</Button>
                </div>
            </div>

        </Card>
    );
}