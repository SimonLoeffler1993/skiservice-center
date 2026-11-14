"use client";

import { ChevronRight } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Kunde } from "@/types/skikundentypes";

export function name(kunde: Kunde) {
    return [kunde.Nachname, kunde.Vorname].filter((teil) => teil?.trim()).join(", ") || "–";
}

export function adresse(kunde: Kunde) {
    // PLZ ist in der Datenbank eine Zahl, führende Nullen auffüllen
    const ort = kunde.Ort ? `${String(kunde.Ort.Postlz).padStart(5, "0")} ${kunde.Ort.Ort}` : "";
    return [kunde.Strasse, ort].filter((teil) => teil?.trim()).join(", ") || "–";
}

export function telefon(kunde: Kunde) {
    return kunde.Tel?.trim() || kunde.Handy?.trim() || "–";
}

// Kunden zum Anklicken: auf dem Handy als Liste, ab Tablet als Tabelle
export default function KundenTabelle({ kunden, onAuswaehlen }: { kunden: Kunde[]; onAuswaehlen: (kunde: Kunde) => void }) {
    return (
        <>
            {/* Handy: Liste aus großen Buttons */}
            <ul className="space-y-2 sm:hidden">
                {kunden.map((kunde) => (
                    <li key={kunde.ID}>
                        <button
                            type="button"
                            onClick={() => onAuswaehlen(kunde)}
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
                    {kunden.map((kunde) => (
                        <TableRow
                            key={kunde.ID}
                            tabIndex={0}
                            aria-label={`Kunde ${name(kunde)} auswählen`}
                            className="cursor-pointer hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                            onClick={() => onAuswaehlen(kunde)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    onAuswaehlen(kunde);
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
        </>
    );
}
