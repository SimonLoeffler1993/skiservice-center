"use client"
import { ListenNummer, ListenTabelle, ListenZeile } from "@/components/liste/ListenTabelle";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ModellArray, Ski, skiText } from "@/types/materialtypes";
import MaterialAktionen, { AusgemustertBadge } from "./bearbeiten/MaterialAktionen";
import { formatMaterialEUR, useSkiBearbeiten } from "./skiBearbeiten";

type SkiTabelleProps = {
    skis: Ski[]
    modelle: ModellArray
    onGeaendert: () => void
}

// Ski als Liste: eine Zeile je Ski mit denselben Angaben und Aktionen wie die Kachel
export default function SkiTabelle({ skis, modelle, onGeaendert }: SkiTabelleProps) {
    return (
        <ListenTabelle>
            <TableHeader>
                <TableRow>
                    <TableHead className="pl-3">Ski-Nr.</TableHead>
                    <TableHead>Modell</TableHead>
                    <TableHead className="hidden lg:table-cell">Art</TableHead>
                    <TableHead className="text-right">Länge</TableHead>
                    <TableHead className="hidden sm:table-cell">Saison</TableHead>
                    <TableHead className="hidden text-right md:table-cell">EK</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">VK</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                    <TableHead className="w-8" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {skis.map((ski) => (
                    <SkiZeile key={ski.ID} ski={ski} modelle={modelle} onGeaendert={onGeaendert} />
                ))}
            </TableBody>
        </ListenTabelle>
    )
}

function SkiZeile({ ski, modelle, onGeaendert }: { ski: Ski; modelle: ModellArray; onGeaendert: () => void }) {
    const { bearbeiten, meldung } = useSkiBearbeiten(ski, modelle, onGeaendert);
    const href = `/material/ski/${ski.ID}`;

    return (
        <ListenZeile href={href} titel={`Ski ${ski.SkiNr}, ${skiText(ski)}`} className={ski.Ausgemustert ? "opacity-60" : undefined}>
            <ListenNummer href={href}>{ski.SkiNr}</ListenNummer>
            <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{ski.Modell.Modell}</span>
                    {ski.Ausgemustert && <AusgemustertBadge />}
                </div>
                <div className="text-xs text-muted-foreground">{ski.Modell.Hersteller.Name}</div>
                {meldung && <p className="text-xs text-green-700">{meldung}</p>}
            </TableCell>
            <TableCell className="hidden lg:table-cell">{ski.Modell.Art.Art}</TableCell>
            <TableCell className="text-right whitespace-nowrap">{ski.Laenge} cm</TableCell>
            <TableCell className="hidden sm:table-cell">{ski.Saison}</TableCell>
            <TableCell className="hidden text-right md:table-cell">{formatMaterialEUR(ski.EK)}</TableCell>
            <TableCell className="hidden text-right font-medium sm:table-cell">{formatMaterialEUR(ski.VK)}</TableCell>
            {/* Klicks auf die Aktionen und in ihren Dialogen dürfen die Zeile nicht öffnen */}
            <TableCell className="cursor-default" onClick={(event) => event.stopPropagation()}>
                <MaterialAktionen
                    art="ski"
                    id={ski.ID}
                    bezeichnung={`Ski ${ski.SkiNr}`}
                    ausgemustert={ski.Ausgemustert}
                    bearbeiten={bearbeiten}
                    onGeaendert={onGeaendert}
                />
            </TableCell>
        </ListenZeile>
    )
}
