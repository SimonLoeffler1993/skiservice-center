import { BadgeCheck, Package } from "lucide-react";

import { ListenKarte } from "@/components/liste/ListenTeile";
import { euro } from "@/lib/utils";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import SaisonverleihCardBezahlt from "./SaisonverleihCardBezahlt";
import SaisonverleihCardStatus from "./SaisonverleihCardStatus";
import VerleihArtBadge from "./VerleihArtBadge";
import VerleihBenachrichtigtBadge from "./VerleihBenachrichtigtBadge";
import { verleihUebersicht } from "./verleihUebersicht";

type SaisonverleihListeCardProps = {
    saisonverleih: SaisonverleihRead;
}

// Verleih in der Liste: Nummer und Status, Kunde, Art und Material, Bezahlung und Betrag
export default function SaisonverleihListeCard({ saisonverleih: verleih }: SaisonverleihListeCardProps) {
    const { kunde, gesamt, anzahl, geprueft, zeigeBindung, zeigeBenachrichtigt, materialText } = verleihUebersicht(verleih);

    return (
        <ListenKarte href={`/saisonverleih/anzeigen/${verleih.ID}`}>
            <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-bold tracking-tight">{verleih.Name}</p>
                <SaisonverleihCardStatus status={verleih.Status} />
            </div>
            <p className="truncate font-semibold">{kunde}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <VerleihArtBadge art={verleih.Art} startAm={verleih.Start_Am} endeAm={verleih.Ende_Am} />
                <span className="inline-flex items-center gap-1.5">
                    <Package className="h-4 w-4" />
                    {materialText}
                </span>
                {zeigeBindung && (
                    <span className={`inline-flex items-center gap-1.5 ${geprueft === anzahl ? "text-green-700" : ""}`}>
                        <BadgeCheck className="h-4 w-4" />
                        Bindung {geprueft}/{anzahl}
                    </span>
                )}
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                    <SaisonverleihCardBezahlt bezahlt={verleih.Bezahlt} />
                    {zeigeBenachrichtigt && <VerleihBenachrichtigtBadge benachrichtigt={verleih.Benachrichtigt} am={verleih.Benachrichtigt_Am} />}
                </div>
                <span className="shrink-0 font-semibold tabular-nums">{euro.format(gesamt)}</span>
            </div>
        </ListenKarte>
    );
}
