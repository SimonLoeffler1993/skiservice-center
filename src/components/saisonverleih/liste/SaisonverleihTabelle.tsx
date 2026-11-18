"use client";

import { ListenNummer, ListenTabelle, ListenZeile } from "@/components/liste/ListenTabelle";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, euro } from "@/lib/utils";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import SaisonverleihCardBezahlt from "./SaisonverleihCardBezahlt";
import SaisonverleihCardStatus from "./SaisonverleihCardStatus";
import VerleihArtBadge from "./VerleihArtBadge";
import VerleihBenachrichtigtBadge from "./VerleihBenachrichtigtBadge";
import { verleihUebersicht } from "./verleihUebersicht";

// Verleihe als Liste: eine Zeile je Verleih mit denselben Angaben wie die Kachel
export default function SaisonverleihTabelle({ verleihe }: { verleihe: SaisonverleihRead[] }) {
    return (
        <ListenTabelle>
            <TableHeader>
                <TableRow>
                    <TableHead className="pl-3">Nummer</TableHead>
                    <TableHead>Kunde</TableHead>
                    <TableHead className="hidden xl:table-cell">Art</TableHead>
                    <TableHead className="hidden md:table-cell">Material</TableHead>
                    <TableHead className="hidden lg:table-cell">Bindung</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Bezahlung</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Betrag</TableHead>
                    <TableHead className="w-8" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {verleihe.map((verleih) => {
                    const { kunde, gesamt, anzahl, geprueft, zeigeBindung, zeigeBenachrichtigt, materialText } = verleihUebersicht(verleih);
                    const href = `/saisonverleih/anzeigen/${verleih.ID}`;
                    return (
                        <ListenZeile key={verleih.ID} href={href} titel={`${verleih.Name}, ${kunde}`}>
                            <ListenNummer href={href}>{verleih.Name}</ListenNummer>
                            <TableCell className="max-w-40 truncate font-semibold lg:max-w-64">{kunde}</TableCell>
                            <TableCell className="hidden xl:table-cell">
                                <VerleihArtBadge art={verleih.Art} startAm={verleih.Start_Am} endeAm={verleih.Ende_Am} />
                            </TableCell>
                            <TableCell className="hidden text-muted-foreground md:table-cell">{materialText}</TableCell>
                            <TableCell className={cn("hidden tabular-nums text-muted-foreground lg:table-cell", zeigeBindung && geprueft === anzahl && "text-green-700")}>
                                {zeigeBindung && `${geprueft}/${anzahl}`}
                            </TableCell>
                            <TableCell><SaisonverleihCardStatus status={verleih.Status} /></TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                    <SaisonverleihCardBezahlt bezahlt={verleih.Bezahlt} />
                                    {zeigeBenachrichtigt && <VerleihBenachrichtigtBadge benachrichtigt={verleih.Benachrichtigt} am={verleih.Benachrichtigt_Am} />}
                                </div>
                            </TableCell>
                            <TableCell className="hidden text-right font-semibold tabular-nums sm:table-cell">{euro.format(gesamt)}</TableCell>
                        </ListenZeile>
                    );
                })}
            </TableBody>
        </ListenTabelle>
    );
}
