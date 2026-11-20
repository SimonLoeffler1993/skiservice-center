"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, KeyRound, LogOut, MonitorSmartphone, Pencil, Plus, Trash2 } from "lucide-react";

import EingabeDialog from "@/components/benutzer/EingabeDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBenutzer } from "@/context/benutzer-context";
import { geraeteschluesselOptions, geraetesitzungenOptions } from "@/hooks/useBenutzerOptions";
import {
    aendereGeraeteschluessel, aendereGeraetesitzung, legeGeraeteschluesselAn, loescheGeraeteschluessel, meldeGeraetAb,
} from "@/lib/geraeteactions";
import { ApiAntwort } from "@/types/actiontypes";
import type { Geraetesitzung } from "@/types/benutzer";

function datumZeit(wert?: string | null) {
    if (!wert) return "nie";
    return new Date(wert).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const BEREICHE = { scanner: "Hardware-Scanner", terminal: "Kundenterminal" } as const;

function SchluesselTab() {
    const { data, isLoading } = useQuery(geraeteschluesselOptions);
    const queryClient = useQueryClient();
    const [neuOffen, setNeuOffen] = useState(false);
    const [erzeugt, setErzeugt] = useState<{ name: string; schluessel: string } | null>(null);
    const [kopiert, setKopiert] = useState(false);
    const [meldung, setMeldung] = useState<string | null>(null);

    async function ausfuehren(aktion: () => Promise<ApiAntwort<unknown>>) {
        const antwort = await aktion();
        setMeldung(antwort.success ? null : antwort.error);
        await queryClient.invalidateQueries({ queryKey: ["geraete", "schluessel"] });
        return antwort.success ? null : antwort.error;
    }

    const kopieren = async () => {
        if (!erzeugt) return;
        try {
            await navigator.clipboard.writeText(erzeugt.schluessel);
            setKopiert(true);
        } catch {
            // Ohne HTTPS gibt es keine Zwischenablage: Schlüssel steht zum Markieren da
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle>Geräteschlüssel</CardTitle>
                    <CardDescription>
                        Hardware-Scanner und Kundenterminal melden sich mit einem eigenen Schlüssel an.
                        Scanner: auf der Konfigurationsseite des Scanners bzw. im Webflasher eintragen. Terminal: Umgebungsvariable GERAETE_SCHLUESSEL.
                    </CardDescription>
                </div>
                <Button onClick={() => setNeuOffen(true)}><Plus /> Neuer Schlüssel</Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {erzeugt && (
                    <Alert>
                        <KeyRound />
                        <AlertTitle>Schlüssel für „{erzeugt.name}“ – nur jetzt sichtbar</AlertTitle>
                        <AlertDescription className="space-y-2">
                            <code className="block select-all break-all rounded bg-muted p-2 text-sm">{erzeugt.schluessel}</code>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={kopieren}><Copy /> {kopiert ? "Kopiert" : "Kopieren"}</Button>
                                <Button size="sm" variant="ghost" onClick={() => setErzeugt(null)}>Ausblenden</Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}
                {meldung && <p className="text-sm text-destructive">{meldung}</p>}
                {isLoading ? <p>Wird geladen…</p> : !data?.success ? <p>{data?.error}</p> : data.data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Noch keine Geräteschlüssel.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Für</TableHead>
                                <TableHead className="hidden sm:table-cell">Schlüssel</TableHead>
                                <TableHead className="hidden md:table-cell">Zuletzt benutzt</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-24 text-right" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data.map((s) => (
                                <TableRow key={s.id} className={!s.aktiv ? "opacity-60" : undefined}>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell>{BEREICHE[s.bereich]}</TableCell>
                                    <TableCell className="hidden font-mono text-xs sm:table-cell">{s.praefix}…</TableCell>
                                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{datumZeit(s.zuletzt_benutzt)}</TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="ghost" onClick={() => ausfuehren(() => aendereGeraeteschluessel(s.id, { aktiv: !s.aktiv }))}>
                                            <Badge variant={s.aktiv ? "outline" : "secondary"}>{s.aktiv ? "aktiv" : "gesperrt"}</Badge>
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="icon" variant="ghost" aria-label={`${s.name} löschen`}
                                            onClick={() => window.confirm(`Schlüssel „${s.name}“ löschen? Das Gerät kann sich danach nicht mehr anmelden.`) && ausfuehren(() => loescheGeraeteschluessel(s.id))}>
                                            <Trash2 />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <EingabeDialog
                offen={neuOffen}
                onOffenChange={setNeuOffen}
                titel="Neuer Geräteschlüssel"
                beschreibung="Der Schlüssel wird nur einmal angezeigt. Gespeichert wird nur ein Hash."
                aktionText="Erzeugen"
                onAbsenden={async (daten) => {
                    const name = String(daten.get("name") ?? "").trim();
                    const antwort = await legeGeraeteschluesselAn(name, (daten.get("bereich") as "scanner" | "terminal") ?? "scanner");
                    if (!antwort.success) return antwort.error;
                    setErzeugt({ name, schluessel: antwort.data.schluessel });
                    setKopiert(false);
                    await queryClient.invalidateQueries({ queryKey: ["geraete", "schluessel"] });
                    return null;
                }}
            >
                <div className="space-y-1">
                    <Label htmlFor="s-name">Name</Label>
                    <Input id="s-name" name="name" required maxLength={100} placeholder="z.B. Scanner Werkstatt" />
                </div>
                <div className="space-y-1">
                    <Label>Für</Label>
                    <Select name="bereich" defaultValue="scanner">
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="scanner">Hardware-Scanner</SelectItem>
                            <SelectItem value="terminal">Kundenterminal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </EingabeDialog>
        </Card>
    );
}

function SitzungenTab() {
    const { data, isLoading } = useQuery(geraetesitzungenOptions);
    const queryClient = useQueryClient();
    const { geraet: diesesGeraet } = useBenutzer();
    const [bearbeiten, setBearbeiten] = useState<Geraetesitzung | null>(null);
    const [meldung, setMeldung] = useState<string | null>(null);

    async function ausfuehren(aktion: () => Promise<ApiAntwort<unknown>>) {
        const antwort = await aktion();
        setMeldung(antwort.success ? null : antwort.error);
        await queryClient.invalidateQueries({ queryKey: ["geraete", "sitzungen"] });
        return antwort.success ? null : antwort.error;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Angemeldete Geräte</CardTitle>
                <CardDescription>
                    Tablets und Kassen bleiben angemeldet. Abmelden erzwingt dort eine neue Anmeldung mit Passwort.
                    Für Wand-Tablets (Werkstatt, Scanner) kann die automatische Bediener-Abmeldung ausgeschaltet werden.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {meldung && <p className="text-sm text-destructive">{meldung}</p>}
                {isLoading ? <p>Wird geladen…</p> : !data?.success ? <p>{data?.error}</p> : data.data.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Kein Gerät angemeldet.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Gerät</TableHead>
                                <TableHead>Bediener</TableHead>
                                <TableHead className="hidden md:table-cell">Zuletzt aktiv</TableHead>
                                <TableHead className="hidden md:table-cell">Abmeldung nach</TableHead>
                                <TableHead className="w-24" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.data.map((g) => (
                                <TableRow key={g.id}>
                                    <TableCell>
                                        <div className="font-medium">
                                            {g.name}{g.id === diesesGeraet?.id && <span className="text-muted-foreground"> (dieses Gerät)</span>}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {g.art === "kasse" ? "Kasse" : "Center"} · angemeldet von {g.angemeldet_von ?? "?"} am {datumZeit(g.erstellt_am)}
                                        </div>
                                    </TableCell>
                                    <TableCell>{g.bediener ?? <span className="text-muted-foreground">–</span>}</TableCell>
                                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{datumZeit(g.zuletzt_gesehen)}</TableCell>
                                    <TableCell className="hidden text-sm md:table-cell">
                                        {g.bediener_timeout_minuten == null ? "Einstellung" : g.bediener_timeout_minuten === 0 ? "nie" : `${g.bediener_timeout_minuten} min`}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="icon" variant="ghost" aria-label={`${g.name} bearbeiten`} onClick={() => setBearbeiten(g)}><Pencil /></Button>
                                        <Button size="icon" variant="ghost" aria-label={`${g.name} abmelden`}
                                            onClick={() => window.confirm(`„${g.name}“ abmelden?`) && ausfuehren(() => meldeGeraetAb(g.id))}>
                                            <LogOut />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <EingabeDialog
                offen={bearbeiten !== null}
                onOffenChange={(auf) => !auf && setBearbeiten(null)}
                titel={`${bearbeiten?.name ?? ""} bearbeiten`}
                aktionText="Speichern"
                onAbsenden={(daten) => {
                    const timeout = String(daten.get("timeout") ?? "");
                    return ausfuehren(() => aendereGeraetesitzung(bearbeiten!.id, {
                        name: String(daten.get("name") ?? "").trim() || undefined,
                        bediener_timeout_minuten: timeout === "" ? null : Number(timeout),
                    }));
                }}
            >
                <div className="space-y-1">
                    <Label htmlFor="g-name">Name</Label>
                    <Input id="g-name" name="name" maxLength={100} defaultValue={bearbeiten?.name} required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="g-timeout">Bediener abmelden nach Minuten ohne Aktivität</Label>
                    <Input id="g-timeout" name="timeout" type="number" min={0} max={1440}
                        defaultValue={bearbeiten?.bediener_timeout_minuten ?? ""} placeholder="leer = Einstellung" />
                    <p className="text-xs text-muted-foreground">0 = nie (z.B. Werkstatt-Tablet an der Wand), leer = wie unter Einstellungen.</p>
                </div>
            </EingabeDialog>
        </Card>
    );
}

export default function GeraeteVerwaltung() {
    return (
        <Tabs defaultValue="schluessel">
            <TabsList>
                <TabsTrigger value="schluessel"><KeyRound /> Geräteschlüssel</TabsTrigger>
                <TabsTrigger value="sitzungen"><MonitorSmartphone /> Angemeldete Geräte</TabsTrigger>
            </TabsList>
            <TabsContent value="schluessel"><SchluesselTab /></TabsContent>
            <TabsContent value="sitzungen"><SitzungenTab /></TabsContent>
        </Tabs>
    );
}
