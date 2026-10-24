"use client";

import { ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Kunde, SkiSuchKunde } from "@/types/skikundentypes";
import { useKundeStore } from "@/stores/useKundeStore";
import KundeErfassenDialog from "@/components/kunde/KundeErfassenDialog";

type KundeSuchErgebnisseTabelleProps = {
    daten: Kunde[] | null;
    // Suchbegriffe, zur Vorbelegung beim Neuanlegen
    suche?: SkiSuchKunde;
    onKundeAuswaehlen?: (kunde: Kunde) => void;
};

function name(kunde: Kunde) {
    return [kunde.Nachname, kunde.Vorname].filter((teil) => teil?.trim()).join(", ") || "–";
}

function adresse(kunde: Kunde) {
    const ort = kunde.Ort ? `${kunde.Ort.Postlz} ${kunde.Ort.Ort}` : "";
    return [kunde.Strasse, ort].filter((teil) => teil?.trim()).join(", ") || "–";
}

function telefon(kunde: Kunde) {
    return kunde.Tel?.trim() || kunde.Handy?.trim() || "–";
}

export default function KundeSuchErgebnisseTabelle({ daten, suche, onKundeAuswaehlen }: KundeSuchErgebnisseTabelleProps) {
    const { setKunde } = useKundeStore();

    function auswaehlen(kunde: Kunde) {
        setKunde(kunde);
        onKundeAuswaehlen?.(kunde);
    }

    // Neu angelegter Kunde wird genauso übernommen wie ein gefundener
    const neuAnlegen = (hervorheben: boolean) => (
        <KundeErfassenDialog
            vorname={suche?.Vorname?.trim()}
            nachname={suche?.Nachname?.trim()}
            onGespeichert={auswaehlen}
            hervorheben={hervorheben}
        />
    );

    if (!daten || daten.length === 0) {
        return (
            <div className="mt-6 flex flex-col items-start gap-3 rounded-lg border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground">Kein Kunde gefunden.</p>
                {neuAnlegen(true)}
            </div>
        );
    }

    return (
        <Card className="mt-6">
            <CardContent className="space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">Gefundene Kunden ({daten.length})</h3>
                    <p className="text-sm text-muted-foreground">Zum Auswählen anklicken</p>
                </div>

                {/* Handy: Liste aus großen Buttons */}
                <ul className="space-y-2 sm:hidden">
                    {daten.map((kunde) => (
                        <li key={kunde.ID}>
                            <button
                                type="button"
                                onClick={() => auswaehlen(kunde)}
                                className="flex min-h-12 w-full items-center gap-3 rounded-md border p-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold">{name(kunde)}</p>
                                    <p className="text-sm text-muted-foreground break-words">{adresse(kunde)}</p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {telefon(kunde)}{kunde.Email ? ` · ${kunde.Email}` : ""}
                                    </p>
                                </div>
                                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Ab Tablet: Tabelle, die ganze Zeile ist anklickbar */}
                <Table className="hidden sm:table">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Adresse</TableHead>
                            <TableHead className="hidden md:table-cell">Telefon</TableHead>
                            <TableHead className="hidden lg:table-cell">E-Mail</TableHead>
                            <TableHead className="w-8" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {daten.map((kunde) => (
                            <TableRow
                                key={kunde.ID}
                                tabIndex={0}
                                aria-label={`Kunde ${name(kunde)} auswählen`}
                                className="cursor-pointer hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                                onClick={() => auswaehlen(kunde)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        auswaehlen(kunde);
                                    }
                                }}
                            >
                                <TableCell className="font-semibold">{name(kunde)}</TableCell>
                                <TableCell className="whitespace-normal">{adresse(kunde)}</TableCell>
                                <TableCell className="hidden md:table-cell">{telefon(kunde)}</TableCell>
                                <TableCell className="hidden lg:table-cell">{kunde.Email || "–"}</TableCell>
                                <TableCell>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="border-t pt-3">{neuAnlegen(false)}</div>
            </CardContent>
        </Card>
    );
}
