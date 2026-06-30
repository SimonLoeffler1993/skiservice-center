import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Auftrag } from "@/types/skiservicetypes";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuftragStatus } from "./AuftragStatus";
import { AuftragBezahlt } from "./AuftragBezahlt";
import { AuftragBenachrichtigt } from "./AuftragBenachrichtigt";

type AuftragKurzCardProps = {
    skiserviceAuftrag: Auftrag;
}

export default function AuftragKurzCard({ skiserviceAuftrag }: AuftragKurzCardProps){
    const router = useRouter()
    return (
        <Card>
            <div className="p-3">
                <p>{skiserviceAuftrag.name}</p>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <div className="text-base font-semibold leading-tight flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {skiserviceAuftrag.kunde.Nachname}, {skiserviceAuftrag.kunde.Vorname}
                        </div>
                        {/* TODO zusammenfassung anzahl ski, schuh, stock */}
                        <div className="text-xs text-muted-foreground"> #{skiserviceAuftrag.skis.length} Services</div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <AuftragStatus status={skiserviceAuftrag.wie} />
                        <AuftragBenachrichtigt benachrichtigt={skiserviceAuftrag.benachrichtigt} />
                        <AuftragBezahlt bezahlt={skiserviceAuftrag.bezahlt} />
                    </div>
                </div>
                <div className="flex justify-end p-2">
                    <Button variant="outline" onClick={() => { router.push(`/skiservice/anzeigen/${skiserviceAuftrag.id}`) }}>Details</Button>
                </div>
            </div>
        </Card>
    )
}