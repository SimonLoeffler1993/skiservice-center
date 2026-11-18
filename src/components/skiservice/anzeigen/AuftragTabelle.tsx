"use client";

import { ListenNummer, ListenTabelle, ListenZeile } from "@/components/liste/ListenTabelle";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { euro } from "@/lib/utils";
import { Auftrag } from "@/types/skiservicetypes";
import { AuftragBenachrichtigt } from "./AuftragBenachrichtigt";
import { AuftragBezahlt } from "./AuftragBezahlt";
import AuftragFertigBis from "./AuftragFertigBis";
import { AuftragStatus } from "./AuftragStatus";
import { auftragUebersicht } from "./auftragUebersicht";

// Aufträge als Liste: eine Zeile je Auftrag mit denselben Angaben wie die Kachel
export default function AuftragTabelle({ auftraege }: { auftraege: Auftrag[] }) {
    return (
        <ListenTabelle>
            <TableHeader>
                <TableRow>
                    <TableHead className="pl-3">Nummer</TableHead>
                    <TableHead>Kunde</TableHead>
                    <TableHead className="hidden md:table-cell">Ski</TableHead>
                    <TableHead className="hidden lg:table-cell">Fertig bis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Bezahlung</TableHead>
                    <TableHead className="hidden text-right sm:table-cell">Betrag</TableHead>
                    <TableHead className="w-8" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {auftraege.map((auftrag) => {
                    const { nummer, kunde, offen, gesamt } = auftragUebersicht(auftrag);
                    const href = `/skiservice/anzeigen/${auftrag.id}`;
                    return (
                        <ListenZeile key={auftrag.id} href={href} titel={`${nummer}, ${kunde}`}>
                            <ListenNummer href={href}>{nummer}</ListenNummer>
                            <TableCell className="max-w-40 truncate font-semibold lg:max-w-64">{kunde}</TableCell>
                            <TableCell className="hidden text-muted-foreground md:table-cell">
                                {auftrag.skis.length} Ski{offen > 0 && auftrag.skis.length > 0 ? ` · ${offen} offen` : ""}
                            </TableCell>
                            <TableCell className="hidden text-muted-foreground lg:table-cell">
                                {auftrag.wie !== "2" && <AuftragFertigBis fertigBis={auftrag.abhol_date} kurz warnen={auftrag.wie !== "1"} />}
                            </TableCell>
                            <TableCell><AuftragStatus status={auftrag.wie} /></TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex gap-1.5">
                                    <AuftragBezahlt bezahlt={auftrag.bezahlt} />
                                    {/* Benachrichtigung ist erst wichtig, wenn der Auftrag fertig ist */}
                                    {auftrag.wie === "1" && <AuftragBenachrichtigt benachrichtigt={auftrag.benachrichtigt} />}
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
