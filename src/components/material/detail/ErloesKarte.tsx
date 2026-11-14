import { TrendingUp } from "lucide-react";

import { DetailKarte } from "@/components/detail/DetailKopf";
import { euro } from "@/lib/utils";
import { ErloesSummen } from "@/types/materialdetailtypes";

type ErloesKarteProps = {
    summen: ErloesSummen;
    // Anzahl Services, nur beim Ski. Ohne Angabe entfällt die Zeile
    anzahlServices?: number;
    ek: number;
    // Anteil dieses Materials, wenn Ski und Schuh in einer Verleihzeile stehen
    anteilProzent: number;
    // "Schuh" beim Ski, "Ski" beim Schuh
    anderesTeil: string;
};

function Zeile({ text, betrag, stark }: { text: React.ReactNode; betrag: number; stark?: boolean }) {
    return (
        <div className={`flex items-baseline justify-between gap-4 ${stark ? "border-t pt-2 text-base font-semibold" : "text-sm"}`}>
            <span className={stark ? "" : "text-muted-foreground"}>{text}</span>
            <span className="tabular-nums">{euro.format(betrag)}</span>
        </div>
    );
}

// Was das Materialstück erwirtschaftet hat: Anteile aus allen Verleihen abzüglich Services
export default function ErloesKarte({ summen, anzahlServices, ek, anteilProzent, anderesTeil }: ErloesKarteProps) {
    const nachEk = summen.Ergebnis - ek;
    return (
        <DetailKarte titel="Erwirtschaftet" icon={TrendingUp}>
            <div className="space-y-2">
                <Zeile
                    text={`Verleih (${summen.AnzahlVerleihe} ${summen.AnzahlVerleihe === 1 ? "Verleih" : "Verleihe"})`}
                    betrag={summen.Einnahmen}
                />
                {anzahlServices !== undefined && (
                    <Zeile
                        text={`Services (${anzahlServices})`}
                        betrag={-summen.ServiceAbzug}
                    />
                )}
                <Zeile text="Erwirtschaftet" betrag={summen.Ergebnis} stark />
                <div className={`flex items-baseline justify-between gap-4 text-sm ${nachEk >= 0 ? "text-green-700" : "text-muted-foreground"}`}>
                    <span>Nach Einkaufspreis ({euro.format(ek)})</span>
                    <span className="tabular-nums">{euro.format(nachEk)}</span>
                </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
                Es zählen alle Verleihe, auch noch nicht bezahlte. Mit {anderesTeil} in derselben Verleihzeile zählen {anteilProzent} % des
                Preises, sonst der ganze Preis. Stöcke zählen nicht. Der Anteil wird unter Verwalten → Einstellungen → Verleih festgelegt.
            </p>
        </DetailKarte>
    );
}
