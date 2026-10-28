import { BadgeCheck, Package } from "lucide-react";

import { ListenKarte } from "@/components/liste/ListenTeile";
import { euro } from "@/lib/utils";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import SaisonverleihCardBezahlt from "./SaisonverleihCardBezahlt";
import SaisonverleihCardStatus from "./SaisonverleihCardStatus";
import VerleihArtBadge from "./VerleihArtBadge";
import VerleihBenachrichtigtBadge from "./VerleihBenachrichtigtBadge";

type SaisonverleihListeCardProps = {
    saisonverleih: SaisonverleihRead;
}

// z.B. "2 Ski · 1 Schuh · 1 Stock", ohne Teile "Nur Preis"
function materialText(verleih: SaisonverleihRead) {
    const material = verleih.Material ?? [];
    const teile = [
        [material.filter((m) => m.skinr).length, "Ski"],
        [material.filter((m) => m.schuhnr).length, "Schuh"],
        [material.filter((m) => m.stockbez_ID).length, "Stock"],
    ] as const;
    const text = teile.filter(([anzahl]) => anzahl > 0).map(([anzahl, name]) => `${anzahl} ${name}`).join(" · ");
    return text || `${material.length} × nur Preis`;
}

// Verleih in der Liste: Nummer und Status, Kunde, Art und Material, Bezahlung und Betrag
export default function SaisonverleihListeCard({ saisonverleih: verleih }: SaisonverleihListeCardProps) {
    const material = verleih.Material ?? [];
    const gesamt = material.reduce((summe, m) => summe + m.Preis, 0);
    const mitSki = material.filter((m) => m.skinr);
    const geprueft = mitSki.filter((m) => m.BindungGeprueft).length;
    // Bindungsfortschritt nur, solange der Verleih vorbereitet wird
    const zeigeBindung = mitSki.length > 0 && (verleih.Status === "vorbereitung" || verleih.Status === "vorbereitet");
    // "Nicht benachrichtigt" nur, wenn der Verleih abholbereit ist
    const zeigeBenachrichtigt = verleih.Benachrichtigt !== "nein" || verleih.Status === "vorbereitet";
    const kunde = [verleih.Kunde?.Nachname, verleih.Kunde?.Vorname].filter(Boolean).join(", ");

    return (
        <ListenKarte href={`/saisonverleih/anzeigen/${verleih.ID}`}>
            <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-bold tracking-tight">{verleih.Name}</p>
                <SaisonverleihCardStatus status={verleih.Status} />
            </div>
            <p className="truncate font-semibold">{kunde || "Ohne Kunde"}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <VerleihArtBadge art={verleih.Art} startAm={verleih.Start_Am} endeAm={verleih.Ende_Am} />
                <span className="inline-flex items-center gap-1.5">
                    <Package className="h-4 w-4" />
                    {materialText(verleih)}
                </span>
                {zeigeBindung && (
                    <span className={`inline-flex items-center gap-1.5 ${geprueft === mitSki.length ? "text-green-700" : ""}`}>
                        <BadgeCheck className="h-4 w-4" />
                        Bindung {geprueft}/{mitSki.length}
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
