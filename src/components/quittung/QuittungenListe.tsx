"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Ban, ChevronDown, ChevronRight, FileText } from "lucide-react";

import LoeschenDialog from "@/components/bearbeiten/LoeschenDialog";
import { useBenutzer } from "@/context/benutzer-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getQuittungenListe, storniereQuittung } from "@/lib/quittungactions";
import { QuittungListeEintrag } from "@/types/quittungentypes";

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function datum(wert: string | null | undefined) {
    return wert ? format(parseISO(wert), "dd.MM.yyyy") : "–";
}

type QuittungenListeProps = {
    saisonID: number;
};

// Alle Quittungen einer Saison
export default function QuittungenListe({ saisonID }: QuittungenListeProps) {
    const { data, error, isPending } = useQuery({
        queryKey: ["quittungenListe", saisonID],
        queryFn: () => getQuittungenListe(saisonID),
    });

    if (isPending) return <p className="text-sm text-muted-foreground">Lade Quittungen...</p>;
    if (error) return <p className="text-sm text-destructive">{error.message}</p>;
    if (data.length === 0) {
        return <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">Keine Quittungen in dieser Saison.</p>;
    }
    return <QuittungenTabelle quittungen={data} />;
}

// Tabelle mit Summe, jede Zeile lässt sich aufklappen und zeigt die Artikel (auch auf der Kundenseite)
export function QuittungenTabelle({ quittungen: data }: { quittungen: QuittungListeEintrag[] }) {
    const [offen, setOffen] = useState<Set<number>>(new Set());
    const alleOffen = offen.size === data.length;
    // Stornierte Quittungen zählen nicht zur Summe
    const storniert = data.filter((q) => q.Storniert).length;
    const summe = data.reduce((gesamt, q) => gesamt + (q.Storniert ? 0 : q.Betrag), 0);

    function umschalten(id: number) {
        setOffen((vorher) => {
            const neu = new Set(vorher);
            if (neu.has(id)) neu.delete(id);
            else neu.add(id);
            return neu;
        });
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => setOffen(alleOffen ? new Set() : new Set(data.map((q) => q.ID)))}>
                    {alleOffen ? "Alle zuklappen" : "Alle aufklappen"}
                </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-8" />
                            <TableHead>Nr.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead>Kunde</TableHead>
                            <TableHead>Bezug</TableHead>
                            <TableHead>Zahlart</TableHead>
                            <TableHead className="text-right">Betrag</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-20" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((quittung) => (
                            <QuittungZeile
                                key={quittung.ID}
                                quittung={quittung}
                                offen={offen.has(quittung.ID)}
                                onUmschalten={() => umschalten(quittung.ID)}
                            />
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={7}>
                                {data.length} {data.length === 1 ? "Quittung" : "Quittungen"}
                                {storniert > 0 && `, davon ${storniert} storniert (nicht in der Summe)`}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{euro.format(summe)}</TableCell>
                            <TableCell colSpan={2} />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    );
}

function QuittungZeile({ quittung, offen, onUmschalten }: { quittung: QuittungListeEintrag; offen: boolean; onUmschalten: () => void }) {
    const queryClient = useQueryClient();
    const { darf } = useBenutzer();

    async function stornieren() {
        const antwort = await storniereQuittung(quittung.ID);
        if (!antwort.success) return antwort.error;
        // Aufträge und Verleihe der Quittung sind wieder offen und ohne Quittung
        for (const schluessel of ["quittungenListe", "quittung", "kunde", "serviceAuftragDetails", "saisonverleihDetails", "skiserviceList", "saisonverleihList", "mailProtokoll", "verlauf"]) {
            queryClient.invalidateQueries({ queryKey: [schluessel] });
        }
        return null;
    }

    return (
        <Fragment>
            <TableRow className="cursor-pointer" onClick={onUmschalten} aria-expanded={offen}>
                <TableCell>
                    {offen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </TableCell>
                <TableCell className="font-medium">{quittung.Nummer}</TableCell>
                <TableCell className="text-muted-foreground">{quittung.Name || "–"}</TableCell>
                <TableCell>{datum(quittung.Bezahlt_Am ?? quittung.Erstellt_Am)}</TableCell>
                <TableCell>{quittung.Kunde ?? "–"}</TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-x-2">
                        {quittung.Bezuege.map((bezug) => (
                            <Link
                                key={`${bezug.art}-${bezug.id}`}
                                href={bezug.art === "auftrag" ? `/skiservice/anzeigen/${bezug.id}` : `/saisonverleih/anzeigen/${bezug.id}`}
                                className="underline-offset-2 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {bezug.name ?? `#${bezug.id}`}
                            </Link>
                        ))}
                    </div>
                </TableCell>
                <TableCell>
                    {quittung.Zahlart || "–"}
                    {quittung.KassiertVonName && <div className="text-xs text-muted-foreground">kassiert von {quittung.KassiertVonName}</div>}
                </TableCell>
                <TableCell className={`text-right tabular-nums ${quittung.Storniert ? "text-muted-foreground line-through" : ""}`}>{euro.format(quittung.Betrag)}</TableCell>
                <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {quittung.Storniert ? (
                            <Badge variant="secondary" className="bg-rose-100 text-rose-800" title={quittung.Storniert_Am ? `Storniert am ${datum(quittung.Storniert_Am)}${quittung.StorniertVonName ? ` von ${quittung.StorniertVonName}` : ""}` : undefined}>
                                storniert
                            </Badge>
                        ) : (
                            <Badge variant={quittung.Bezahlt ? "secondary" : "outline"} className={quittung.Bezahlt ? "bg-emerald-100 text-emerald-800" : "text-amber-700"}>
                                {quittung.Bezahlt ? "bezahlt" : "offen"}
                            </Badge>
                        )}
                        {quittung.NurExtern ? (
                            <Badge variant="outline">Lexware-Rechnung</Badge>
                        ) : quittung.BuchhaltungSync ? (
                            <Badge variant="outline">In Lexware</Badge>
                        ) : null}
                    </div>
                </TableCell>
                {/* Klicks in der Zelle und im Dialog sollen die Zeile nicht auf- oder zuklappen */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                        <a
                            href={`/api/pdf/quittung/${quittung.ID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="PDF öffnen"
                            className="inline-flex text-muted-foreground hover:text-foreground"
                        >
                            <FileText className="h-4 w-4" />
                        </a>
                        {!quittung.Storniert && darf("quittungen.verwalten") && (
                            <LoeschenDialog
                                titel={`Quittung ${quittung.Nummer} stornieren`}
                                beschreibung={
                                    "Die Quittung wird als storniert markiert. Alle Aufträge und Verleihe darauf werden nicht bezahlt, von der Quittung gelöst und an der Kasse wieder angeboten. Verkaufte Handware geht zurück auf den Bestand. Das lässt sich nicht rückgängig machen."
                                    + (quittung.NurExtern || quittung.BuchhaltungSync ? " Der Beleg in Lexware bleibt unverändert und muss dort von Hand storniert werden." : "")
                                }
                                aktionText="Stornieren"
                                aktionLaeuftText="Storniere..."
                                icon={Ban}
                                onLoeschen={stornieren}
                            />
                        )}
                    </div>
                </TableCell>
            </TableRow>
            {offen && (
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableCell />
                    <TableCell colSpan={9} className="py-3">
                        {quittung.artikelgruppen.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Keine Artikel verknüpft.</p>
                        ) : (
                            <div className="space-y-3">
                                {quittung.artikelgruppen.map((gruppe) => (
                                    <div key={`${gruppe.type}-${gruppe.toID}`}>
                                        <p className="mb-1 text-xs font-semibold">{gruppe.bezeichnung}</p>
                                        <table className="w-full max-w-xl text-sm">
                                            <tbody>
                                                {gruppe.artikels.map((artikel, index) => (
                                                    <tr key={index} className="border-b border-border/50 last:border-0">
                                                        <td className="py-1 pr-4">{artikel.bezeichnung}</td>
                                                        <td className="py-1 pr-4 text-right tabular-nums">{artikel.anzahl} ×</td>
                                                        <td className="py-1 pr-4 text-right tabular-nums">{euro.format(artikel.preis)}</td>
                                                        <td className="py-1 text-right font-medium tabular-nums">{euro.format(artikel.preis * artikel.anzahl)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TableCell>
                </TableRow>
            )}
        </Fragment>
    );
}
