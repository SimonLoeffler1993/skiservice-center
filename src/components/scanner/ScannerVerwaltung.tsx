"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { SCANNER_MODI } from "@/components/einstellungen/webflasherUrl";
import { StatusBadge, vorWann } from "@/components/skiservice/fertigstellen/HardwareScannerStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { neuesteFirmwareOptions, scannerGeraeteOptions } from "@/hooks/useScannerGeraeteOptions";
import { starteScannerUpdate } from "@/lib/skiscanneractions";
import { cn } from "@/lib/utils";
import { ScannerGeraet } from "@/types/skiscanner";
import ScannerUpdateDialog from "./ScannerUpdateDialog";

// So lange darf der Scanner nach dem Anstoßen brauchen (er meldet sich alle 30 s)
const REAKTION_MS = 2 * 60_000;

type UpdateStand = { text: string; art: "laeuft" | "ok" | "fehler"; laeuft: boolean };

// Stand des Updates: erst die Anforderung aus dem Center, danach das, was der Scanner selbst meldet
function updateStand(geraet: ScannerGeraet): UpdateStand | null {
    if (geraet.update_angefordert) {
        const wartet = Date.now() - new Date(geraet.update_angefordert).getTime() < REAKTION_MS;
        return wartet
            ? { text: "Angefordert, wartet auf den Scanner…", art: "laeuft", laeuft: true }
            : { text: "Keine Reaktion vom Scanner", art: "fehler", laeuft: false };
    }
    switch (geraet.update_status) {
        case "pruefe":
            return { text: "Prüft auf neue Firmware…", art: "laeuft", laeuft: geraet.verbunden };
        case "laedt":
            return { text: "Lädt und installiert, startet danach neu…", art: "laeuft", laeuft: geraet.verbunden };
        case "aktuell":
            return { text: "Geprüft: bereits aktuell", art: "ok", laeuft: false };
        case "fehlgeschlagen":
            return { text: `Fehlgeschlagen${geraet.update_fehler ? `: ${geraet.update_fehler}` : ""}`, art: "fehler", laeuft: false };
        default:
            return null;
    }
}

function Verbindung({ geraet }: { geraet: ScannerGeraet }) {
    if (!geraet.verbunden) return <StatusBadge farbe="grau" text={`getrennt, zuletzt ${vorWann(geraet.zuletzt)}`} />;
    if (!geraet.usb_scanner) return <StatusBadge farbe="orange" text="USB-Scanner fehlt" />;
    return <StatusBadge farbe="gruen" text="verbunden" />;
}

function gesperrtWeil(geraet: ScannerGeraet, stand: UpdateStand | null): string | undefined {
    if (!geraet.verbunden) return "Der Scanner ist nicht verbunden.";
    if (!geraet.update_faehig) return "Diese Firmware kann sich noch nicht selbst aktualisieren.";
    if (stand?.laeuft) return "Das Update läuft bereits.";
    return undefined;
}

// Alle Hardware-Scanner der letzten 24 h mit Firmware, Firmware-Update per Knopfdruck
export default function ScannerVerwaltung() {
    const queryClient = useQueryClient();
    const { data: geraete, isLoading, error } = useQuery(scannerGeraeteOptions);
    const { data: neueste } = useQuery(neuesteFirmwareOptions);

    if (isLoading) return <p>Scanner werden geladen...</p>;
    if (error || !geraete) return <p>Fehler beim Laden der Scanner{error ? `: ${error.message}` : ""}</p>;

    async function starten(name: string): Promise<string | null> {
        const antwort = await starteScannerUpdate(name);
        if (!antwort.success) return antwort.error;
        queryClient.invalidateQueries({ queryKey: scannerGeraeteOptions.queryKey });
        return null;
    }

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <CardTitle>Scanner ({geraete.length})</CardTitle>
                    <CardDescription>
                        {neueste ? <>Neueste Firmware: <span className="font-mono">{neueste}</span></> : "Neueste Firmware-Version nicht abrufbar."}
                    </CardDescription>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/verwalten/einstellungen?gruppe=scanner#hardware-scanner"><Plus className="h-4 w-4" />Neuen Scanner installieren</Link>
                </Button>
            </CardHeader>
            <CardContent>
                {geraete.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        In den letzten 24 Stunden hat sich kein Scanner gemeldet. Eingeschaltete Scanner erscheinen innerhalb von 30 Sekunden.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Modus</TableHead>
                                <TableHead className="hidden md:table-cell">IP-Adresse</TableHead>
                                <TableHead>Firmware</TableHead>
                                <TableHead className="text-right">Update</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {geraete.map((geraet) => {
                                const stand = updateStand(geraet);
                                const grund = gesperrtWeil(geraet, stand);
                                return (
                                    <TableRow key={geraet.name}>
                                        <TableCell className="font-medium">{geraet.name}</TableCell>
                                        <TableCell><Verbindung geraet={geraet} /></TableCell>
                                        <TableCell>{SCANNER_MODI[geraet.modus] ?? `Modus ${geraet.modus}`}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {geraet.ip ? (
                                                <a className="underline underline-offset-2" href={`http://${geraet.ip}`} target="_blank" rel="noreferrer" title="Konfigurationsseite des Scanners öffnen">
                                                    {geraet.ip}
                                                </a>
                                            ) : <span className="text-muted-foreground">–</span>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-mono text-sm">{geraet.firmware ?? "unbekannt"}</span>
                                                {neueste && geraet.firmware && (
                                                    geraet.firmware === neueste
                                                        ? <StatusBadge farbe="gruen" text="aktuell" />
                                                        : <StatusBadge farbe="orange" text="Update verfügbar" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <ScannerUpdateDialog
                                                    name={geraet.name}
                                                    deaktiviert={grund !== undefined}
                                                    deaktiviertGrund={grund}
                                                    onStarten={() => starten(geraet.name)}
                                                />
                                                {stand && (
                                                    <p className={cn(
                                                        "max-w-xs whitespace-normal text-xs",
                                                        stand.art === "fehler" ? "text-destructive" : stand.art === "ok" ? "text-green-700 dark:text-green-400" : "text-muted-foreground",
                                                    )}>
                                                        {stand.text}
                                                    </p>
                                                )}
                                                {geraet.verbunden && !geraet.update_faehig && (
                                                    <p className="max-w-xs whitespace-normal text-xs text-muted-foreground">
                                                        Ältere Firmware: einmalig über den Webflasher oder die Konfigurationsseite des Scanners aktualisieren.
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
