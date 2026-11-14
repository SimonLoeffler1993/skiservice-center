import { ListenKarte } from "@/components/liste/ListenTeile";
import NachSaison from "@/components/liste/NachSaison";
import SaisonverleihCardBezahlt from "@/components/saisonverleih/liste/SaisonverleihCardBezahlt";
import SaisonverleihCardStatus from "@/components/saisonverleih/liste/SaisonverleihCardStatus";
import VerleihArtBadge from "@/components/saisonverleih/liste/VerleihArtBadge";
import { euro } from "@/lib/utils";
import { MaterialVerleihPosition } from "@/types/materialdetailtypes";
import { SaisonsNamen } from "@/types/saison";

type MaterialVerleihListeProps = {
    verleihe: MaterialVerleihPosition[];
    saisons: SaisonsNamen[];
};

// Was außer dem angezeigten Teil noch in der Zeile steckt, entscheidet über den Anteil
function anteilText(position: MaterialVerleihPosition) {
    if (position.AnteilProzent === 100) return "ganzer Preis";
    return `${position.AnteilProzent} % von ${euro.format(position.Preis)}`;
}

// Jede Verleihzeile mit diesem Material einzeln, je Saison gruppiert. Die Karte führt in den Verleih
export default function MaterialVerleihListe({ verleihe, saisons }: MaterialVerleihListeProps) {
    return (
        <NachSaison
            eintraege={verleihe}
            saisonID={(position) => position.Saison_ID}
            saisons={saisons}
            leer="Noch in keinem Verleih."
            karte={(position) => (
                <ListenKarte key={position.Material_ID} href={`/saisonverleih/anzeigen/${position.Verleih_ID}?material=${position.Material_ID}`}>
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-lg font-bold tracking-tight">{position.Name}</p>
                        <SaisonverleihCardStatus status={position.Status} />
                    </div>
                    <p className="truncate font-semibold">
                        {position.Kunde}
                        {position.Fahrer && <span className="font-normal text-muted-foreground"> · {position.Fahrer}</span>}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <VerleihArtBadge art={position.Art} startAm={position.Start_Am} endeAm={position.Ende_Am} />
                        <SaisonverleihCardBezahlt bezahlt={position.Bezahlt ? 1 : 0} />
                    </div>
                    <div className="flex items-baseline justify-between gap-2 pt-1">
                        <span className="text-sm text-muted-foreground">{anteilText(position)}</span>
                        <span className="shrink-0 font-semibold tabular-nums">{euro.format(position.Anteil)}</span>
                    </div>
                </ListenKarte>
            )}
        />
    );
}
