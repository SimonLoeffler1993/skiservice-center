import { CalendarClock, Mountain } from "lucide-react";

import { ListenKarte } from "@/components/liste/ListenTeile";
import { euro } from "@/lib/utils";
import { Auftrag } from "@/types/skiservicetypes";
import { AuftragBenachrichtigt } from "./AuftragBenachrichtigt";
import { AuftragBezahlt } from "./AuftragBezahlt";
import AuftragFertigBis from "./AuftragFertigBis";
import { AuftragStatus } from "./AuftragStatus";
import { auftragUebersicht } from "./auftragUebersicht";

type AuftragKurzCardProps = {
    skiserviceAuftrag: Auftrag;
}

// Auftrag in der Liste: Nummer und Status, Kunde, Ski und Fertig-Datum, Bezahlung und Betrag
export default function AuftragKurzCard({ skiserviceAuftrag: auftrag }: AuftragKurzCardProps) {
    const { nummer, kunde, offen, gesamt } = auftragUebersicht(auftrag);

    return (
        <ListenKarte href={`/skiservice/anzeigen/${auftrag.id}`}>
            <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-bold tracking-tight">{nummer}</p>
                <AuftragStatus status={auftrag.wie} />
            </div>
            <p className="truncate font-semibold">{kunde}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <Mountain className="h-4 w-4" />
                    {auftrag.skis.length} Ski{offen > 0 && auftrag.skis.length > 0 ? ` · ${offen} offen` : ""}
                </span>
                {auftrag.wie !== "2" && (
                    <span className="inline-flex items-center gap-1.5">
                        <CalendarClock className="h-4 w-4" />
                        <AuftragFertigBis fertigBis={auftrag.abhol_date} kurz warnen={auftrag.wie !== "1"} />
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5">
                    <AuftragBezahlt bezahlt={auftrag.bezahlt} />
                    {/* Benachrichtigung ist erst wichtig, wenn der Auftrag fertig ist */}
                    {auftrag.wie === "1" && <AuftragBenachrichtigt benachrichtigt={auftrag.benachrichtigt} />}
                </div>
                <span className="shrink-0 font-semibold tabular-nums">{euro.format(gesamt)}</span>
            </div>
        </ListenKarte>
    )
}
