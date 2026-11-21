"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, KeyRound, Link2Off, LockOpen, MoreHorizontal, Pencil, Plus, Trash2, UserCheck, UserX, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBenutzer } from "@/context/benutzer-context";
import { benutzerOptions, gruppenOptions } from "@/hooks/useBenutzerOptions";
import {
    aendereBenutzer, entsperreBenutzer, legeBenutzerAn, loescheBenutzer, loescheBenutzerPin, loeseBenutzerOidc,
    setzeBenutzerPasswort, uebernimmOidc,
} from "@/lib/benutzeractions";
import { ApiAntwort } from "@/types/actiontypes";
import type { Benutzer } from "@/types/benutzer";
import BenutzerDialog from "./BenutzerDialog";
import EingabeDialog from "./EingabeDialog";

function datumZeit(wert?: string | null) {
    if (!wert) return "–";
    return new Date(wert).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function StatusBadges({ b }: { b: Benutzer }) {
    return (
        <div className="flex flex-wrap gap-1">
            {b.freigabe_ausstehend && <Badge variant="destructive">Freigabe ausstehend</Badge>}
            {!b.aktiv && !b.freigabe_ausstehend && <Badge variant="secondary">deaktiviert</Badge>}
            {b.gesperrt_bis && <Badge variant="destructive">gesperrt bis {new Date(b.gesperrt_bis).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</Badge>}
            {b.passwort_aendern && <Badge variant="outline">Passwort ändern</Badge>}
            {b.aktiv && !b.gesperrt_bis && !b.passwort_aendern && <Badge variant="outline">aktiv</Badge>}
        </div>
    );
}

function AnmeldeArten({ b }: { b: Benutzer }) {
    return (
        <div className="flex flex-wrap gap-1 text-xs">
            {b.hat_passwort && <Badge variant="secondary">Passwort</Badge>}
            {b.hat_pin && <Badge variant="secondary">PIN</Badge>}
            {b.oidc_verknuepft && <Badge variant={b.oidc_veraltet ? "destructive" : "secondary"}>{b.oidc_veraltet ? "OIDC veraltet" : "OIDC"}</Badge>}
        </div>
    );
}

type OffenerDialog = { art: "passwort" | "uebernehmen"; benutzer: Benutzer } | null;

export default function BenutzerVerwaltung() {
    const { data, isLoading, error } = useQuery(benutzerOptions);
    const { data: gruppenDaten } = useQuery(gruppenOptions);
    const alleGruppen = gruppenDaten?.success ? gruppenDaten.data : [];
    const queryClient = useQueryClient();
    const { benutzer: ich } = useBenutzer();
    const [dialog, setDialog] = useState<OffenerDialog>(null);
    const [meldung, setMeldung] = useState<string | null>(null);

    if (isLoading) return <p>Benutzer werden geladen…</p>;
    if (error) return <p>Fehler beim Laden der Benutzer: {error.message}</p>;
    if (!data?.success) return <p>{data?.error ?? "Benutzer konnten nicht geladen werden."}</p>;

    const liste = data.data;
    const ausstehend = liste.filter((b) => b.freigabe_ausstehend);

    async function ausfuehren(aktion: () => Promise<ApiAntwort<unknown>>): Promise<string | null> {
        const antwort = await aktion();
        if (!antwort.success) {
            setMeldung(antwort.error);
            return antwort.error;
        }
        setMeldung(null);
        await queryClient.invalidateQueries({ queryKey: ["benutzer"] });
        return null;
    }

    return (
        <div className="space-y-4">
            {ausstehend.length > 0 && (
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle>Freigabe ausstehend ({ausstehend.length})</CardTitle>
                        <CardDescription>
                            Diese Personen haben sich über den Anmelde-Anbieter angemeldet. Freigeben aktiviert sie (Rechte über die Gruppen);
                            gehört die Anmeldung zu einem vorhandenen Benutzer, mit „Übernehmen“ zuordnen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {ausstehend.map((b) => (
                            <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-2">
                                <div>
                                    <div className="font-medium">{b.anzeigename}</div>
                                    <div className="text-xs text-muted-foreground">{b.email ?? b.benutzername} · {datumZeit(b.angelegt_am)}</div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" onClick={() => ausfuehren(() => aendereBenutzer(b.id, { freigeben: true }))}>
                                        <Check /> Freigeben
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setDialog({ art: "uebernehmen", benutzer: b })}>
                                        <UserCheck /> Übernehmen in …
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => window.confirm(`${b.anzeigename} ablehnen und löschen?`) && ausfuehren(() => loescheBenutzer(b.id))}>
                                        <UserX /> Ablehnen
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Users className="size-5" /> Benutzer ({liste.length - ausstehend.length})</CardTitle>
                        <CardDescription>Die Rechte ergeben sich aus den Gruppen und deren Rollen. ⇄ = Mitgliedschaft über OIDC.</CardDescription>
                    </div>
                    <BenutzerDialog
                        gruppen={alleGruppen}
                        trigger={<Button><Plus /> Neuer Benutzer</Button>}
                        onAnlegen={(daten) => ausfuehren(() => legeBenutzerAn(daten))}
                    />
                </CardHeader>
                <CardContent>
                    {meldung && <p className="mb-2 text-sm text-destructive">{meldung}</p>}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Gruppen</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Anmeldung</TableHead>
                                <TableHead className="hidden lg:table-cell">Zuletzt angemeldet</TableHead>
                                <TableHead className="w-12" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {liste.filter((b) => !b.freigabe_ausstehend).map((b) => (
                                <TableRow key={b.id} className={!b.aktiv ? "opacity-60" : undefined}>
                                    <TableCell>
                                        <div className="font-medium">{b.anzeigename}{b.id === ich?.id && <span className="text-muted-foreground"> (du)</span>}</div>
                                        <div className="text-xs text-muted-foreground">{b.benutzername}{b.email ? ` · ${b.email}` : ""}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {b.gruppen.length === 0
                                                ? <span className="text-xs text-muted-foreground">keine (nur lesen)</span>
                                                : b.gruppen.map((g) => (
                                                    <Badge key={g.id} variant={b.rechte.includes("*") ? "default" : "secondary"}
                                                        title={g.quelle === "oidc" ? "über OIDC" : undefined}>
                                                        {g.name}{g.quelle === "oidc" ? " ⇄" : ""}
                                                    </Badge>
                                                ))}
                                        </div>
                                    </TableCell>
                                    <TableCell><StatusBadges b={b} /></TableCell>
                                    <TableCell className="hidden md:table-cell"><AnmeldeArten b={b} /></TableCell>
                                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">{datumZeit(b.letzte_anmeldung)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" aria-label={`Aktionen für ${b.anzeigename}`}><MoreHorizontal /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <BenutzerDialog
                                                    gruppen={alleGruppen}
                                                    benutzer={b}
                                                    trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><Pencil /> Bearbeiten</DropdownMenuItem>}
                                                    onAendern={(daten) => ausfuehren(() => aendereBenutzer(b.id, daten))}
                                                />
                                                <DropdownMenuItem onSelect={() => setDialog({ art: "passwort", benutzer: b })}>
                                                    <KeyRound /> Passwort zurücksetzen
                                                </DropdownMenuItem>
                                                {b.hat_pin && (
                                                    <DropdownMenuItem onSelect={() => ausfuehren(() => loescheBenutzerPin(b.id))}>
                                                        <Trash2 /> PIN löschen
                                                    </DropdownMenuItem>
                                                )}
                                                {b.gesperrt_bis && (
                                                    <DropdownMenuItem onSelect={() => ausfuehren(() => entsperreBenutzer(b.id))}>
                                                        <LockOpen /> Entsperren
                                                    </DropdownMenuItem>
                                                )}
                                                {b.oidc_verknuepft && (
                                                    <DropdownMenuItem onSelect={() => ausfuehren(() => loeseBenutzerOidc(b.id))}>
                                                        <Link2Off /> OIDC-Verknüpfung lösen
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onSelect={() => ausfuehren(() => aendereBenutzer(b.id, { aktiv: !b.aktiv }))}>
                                                    {b.aktiv ? <><UserX /> Deaktivieren</> : <><UserCheck /> Aktivieren</>}
                                                </DropdownMenuItem>
                                                {b.id !== ich?.id && (
                                                    <DropdownMenuItem variant="destructive"
                                                        onSelect={() => window.confirm(`${b.anzeigename} endgültig löschen? Der Verlauf behält den Namen.`) && ausfuehren(() => loescheBenutzer(b.id))}>
                                                        <Trash2 /> Löschen
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <EingabeDialog
                offen={dialog?.art === "passwort"}
                onOffenChange={(auf) => !auf && setDialog(null)}
                titel={`Passwort für ${dialog?.benutzer.anzeigename ?? ""} zurücksetzen`}
                beschreibung="Das neue Passwort muss bei der nächsten Anmeldung geändert werden. Eine Sperre wird aufgehoben."
                aktionText="Passwort setzen"
                onAbsenden={(daten) => ausfuehren(() => setzeBenutzerPasswort(dialog!.benutzer.id, String(daten.get("passwort") ?? "")))}
            >
                <div className="space-y-1">
                    <Label htmlFor="r-pw">Neues Passwort</Label>
                    <Input id="r-pw" name="passwort" type="text" autoComplete="off" required />
                </div>
            </EingabeDialog>

            <EingabeDialog
                offen={dialog?.art === "uebernehmen"}
                onOffenChange={(auf) => !auf && setDialog(null)}
                titel="OIDC-Anmeldung übernehmen"
                beschreibung={`Die Anmeldung von „${dialog?.benutzer.anzeigename ?? ""}“ wird einem vorhandenen Benutzer zugeordnet; der ausstehende Eintrag wird gelöscht.`}
                aktionText="Übernehmen"
                onAbsenden={(daten) => ausfuehren(() => uebernimmOidc(Number(daten.get("ziel")), dialog!.benutzer.id))}
            >
                <div className="space-y-1">
                    <Label>Vorhandener Benutzer</Label>
                    <Select name="ziel" required>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Benutzer wählen" /></SelectTrigger>
                        <SelectContent>
                            {liste.filter((b) => !b.freigabe_ausstehend).map((b) => (
                                <SelectItem key={b.id} value={String(b.id)}>{b.anzeigename} ({b.benutzername})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </EingabeDialog>
        </div>
    );
}
