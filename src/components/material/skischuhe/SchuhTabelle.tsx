"use client"
import { ListenNummer, ListenTabelle, ListenZeile } from "@/components/liste/ListenTabelle";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Schuh, SchuhModellArray, schuhText } from "@/types/materialtypes";
import MaterialAktionen, { AusgemustertBadge } from "../bearbeiten/MaterialAktionen";
import { formatMaterialEUR } from "../skiBearbeiten";
import { useSchuhBearbeiten } from "./schuhBearbeiten";

type SchuhTabelleProps = {
    schuhe: Schuh[]
    modelle: SchuhModellArray
    onGeaendert: () => void
}

// Schuhe als Liste: eine Zeile je Schuh mit denselben Angaben und Aktionen wie die Kachel
export default function SchuhTabelle({ schuhe, modelle, onGeaendert }: SchuhTabelleProps) {
    return (
        <ListenTabelle>
            <TableHeader>
                <TableRow>
                    <TableHead className="pl-3">Schuh-Nr.</TableHead>
                    <TableHead>Modell</TableHead>
                    <TableHead className="text-right">Größe</TableHead>
                    <TableHead className="hidden text-right md:table-cell">Sohle</TableHead>
                    <TableHead className="hidden sm:table-cell">Saison</TableHead>
                    <TableHead className="hidden text-right md:table-cell">EK</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">VK</TableHead>
                    <TableHead className="text-right">Aktionen</TableHead>
                    <TableHead className="w-8" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {schuhe.map((schuh) => (
                    <SchuhZeile key={schuh.ID} schuh={schuh} modelle={modelle} onGeaendert={onGeaendert} />
                ))}
            </TableBody>
        </ListenTabelle>
    )
}

function SchuhZeile({ schuh, modelle, onGeaendert }: { schuh: Schuh; modelle: SchuhModellArray; onGeaendert: () => void }) {
    const { bearbeiten } = useSchuhBearbeiten(schuh, modelle, onGeaendert);
    const href = `/material/schuh/${schuh.ID}`;

    return (
        <ListenZeile href={href} titel={`Schuh ${schuh.SchuhNr}, ${schuhText(schuh)}`} className={schuh.Ausgemustert ? "opacity-60" : undefined}>
            <ListenNummer href={href}>{schuh.SchuhNr}</ListenNummer>
            <TableCell>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{schuh.Modell.Modell}</span>
                    {schuh.Modell.Jugend && <span className="rounded-md bg-muted px-2 py-0.5 text-xs">Jugend</span>}
                    {schuh.Ausgemustert && <AusgemustertBadge />}
                </div>
                <div className="text-xs text-muted-foreground">{schuh.Modell.Hersteller.Name}</div>
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">{schuh.Groese} MP</TableCell>
            <TableCell className="hidden text-right whitespace-nowrap md:table-cell">{schuh.Sohle ? `${schuh.Sohle} mm` : "–"}</TableCell>
            <TableCell className="hidden sm:table-cell">{schuh.Saison}</TableCell>
            <TableCell className="hidden text-right md:table-cell">{formatMaterialEUR(schuh.EK)}</TableCell>
            <TableCell className="hidden text-right font-medium sm:table-cell">{formatMaterialEUR(schuh.VK)}</TableCell>
            {/* Klicks auf die Aktionen und in ihren Dialogen dürfen die Zeile nicht öffnen */}
            <TableCell className="cursor-default" onClick={(event) => event.stopPropagation()}>
                <MaterialAktionen
                    art="schuh"
                    id={schuh.ID}
                    bezeichnung={`Schuh ${schuh.SchuhNr}`}
                    ausgemustert={schuh.Ausgemustert}
                    bearbeiten={bearbeiten}
                    onGeaendert={onGeaendert}
                />
            </TableCell>
        </ListenZeile>
    )
}
