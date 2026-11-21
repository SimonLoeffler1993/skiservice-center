"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { rechteKatalogOptions, rollenOptions } from "@/hooks/useBenutzerOptions";
import { aendereRolle, legeRolleAn, loescheRolle } from "@/lib/rechteactions";
import type { RechtInfo, Rolle } from "@/types/benutzer";

/** Rechte nach Bereich, in der Reihenfolge des Katalogs. */
function nachBereich(katalog: RechtInfo[]): [string, RechtInfo[]][] {
    const bereiche = new Map<string, RechtInfo[]>();
    for (const r of katalog) bereiche.set(r.bereich, [...(bereiche.get(r.bereich) ?? []), r]);
    return [...bereiche.entries()];
}

function RolleDialog({ rolle, katalog, offen, onOffenChange, onGespeichert }: {
    rolle: Rolle | null;
    katalog: RechtInfo[];
    offen: boolean;
    onOffenChange: (offen: boolean) => void;
    onGespeichert: () => void;
}) {
    const [name, setName] = useState(rolle?.name ?? "");
    const [beschreibung, setBeschreibung] = useState(rolle?.beschreibung ?? "");
    const [rechte, setRechte] = useState<Set<string>>(new Set(rolle?.rechte ?? []));
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const system = rolle?.system ?? false;

    const umschalten = (recht: string, an: boolean) => {
        const neu = new Set(rechte);
        if (an) neu.add(recht);
        else neu.delete(recht);
        setRechte(neu);
    };

    const speichern = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const daten = system
                ? { beschreibung }
                : { name, beschreibung, rechte: [...rechte].filter((r) => r !== "*") };
            const antwort = rolle ? await aendereRolle(rolle.id, daten) : await legeRolleAn(daten);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            onGespeichert();
            onOffenChange(false);
        });
    };

    return (
        <Dialog open={offen} onOpenChange={onOffenChange}>
            <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl">
                <form onSubmit={speichern} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{rolle ? `Rolle ${rolle.name}` : "Neue Rolle"}</DialogTitle>
                        <DialogDescription>
                            {system
                                ? "Die Systemrolle hat immer alle Rechte, auch neue. Nur die Beschreibung ist änderbar."
                                : "Eine Rolle bündelt Rechte. Gruppen bekommen Rollen, Benutzer sind Mitglied in Gruppen. Lesen dürfen alle Angemeldeten."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label htmlFor="r-name">Name</Label>
                            <Input id="r-name" required maxLength={100} value={name} disabled={system} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="r-beschreibung">Beschreibung</Label>
                            <Input id="r-beschreibung" maxLength={255} value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {nachBereich(katalog).map(([bereich, eintraege]) => (
                            <fieldset key={bereich} className="rounded-md border p-3">
                                <legend className="px-1 text-sm font-medium">{bereich}</legend>
                                <div className="space-y-2">
                                    {eintraege.map((r) => (
                                        <label key={r.recht} className="flex items-start gap-2 text-sm">
                                            <Checkbox
                                                checked={system || rechte.has(r.recht)}
                                                disabled={system}
                                                onCheckedChange={(wert) => umschalten(r.recht, wert === true)}
                                                className="mt-0.5"
                                            />
                                            <span>
                                                <span className="font-mono text-xs text-muted-foreground">{r.recht}</span>
                                                <span className="block">{r.bezeichnung}</span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        ))}
                    </div>
                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>{isPending ? "Speichere…" : "Speichern"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function RollenVerwaltung() {
    const { data: rollen } = useQuery(rollenOptions);
    const { data: katalog } = useQuery(rechteKatalogOptions);
    const queryClient = useQueryClient();
    // key erzwingt frische Werte im Dialog bei jedem Öffnen
    const [dialog, setDialog] = useState<{ rolle: Rolle | null; key: number } | null>(null);
    const [meldung, setMeldung] = useState<string | null>(null);

    const neuLaden = () => {
        queryClient.invalidateQueries({ queryKey: ["rollen"] });
        queryClient.invalidateQueries({ queryKey: ["gruppen"] });
        queryClient.invalidateQueries({ queryKey: ["benutzer"] });
    };

    if (!rollen || !katalog) return <p>Rollen werden geladen…</p>;
    if (!rollen.success || !katalog.success) return <p>{!rollen.success ? rollen.error : !katalog.success ? katalog.error : ""}</p>;
    const bezeichnung = new Map(katalog.data.map((r) => [r.recht, r.bezeichnung]));

    const loeschen = async (rolle: Rolle) => {
        if (!window.confirm(`Rolle „${rolle.name}“ löschen? Gruppen mit dieser Rolle verlieren ihre Rechte.`)) return;
        const antwort = await loescheRolle(rolle.id);
        setMeldung(antwort.success ? null : antwort.error);
        neuLaden();
    };

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5" /> Rollen ({rollen.data.length})</CardTitle>
                    <CardDescription>Rollen bündeln Rechte und werden Gruppen zugewiesen.</CardDescription>
                </div>
                <Button onClick={() => setDialog({ rolle: null, key: Date.now() })}><Plus /> Neue Rolle</Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {meldung && <p className="text-sm text-destructive">{meldung}</p>}
                {rollen.data.map((rolle) => (
                    <div key={rolle.id} className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{rolle.name}</span>
                                {rolle.system && <Badge><Lock className="size-3" /> System</Badge>}
                                <span className="text-xs text-muted-foreground">in {rolle.anzahl_gruppen} Gruppe(n)</span>
                            </div>
                            {rolle.beschreibung && <p className="text-sm text-muted-foreground">{rolle.beschreibung}</p>}
                            <div className="flex flex-wrap gap-1">
                                {rolle.system
                                    ? <Badge variant="secondary">alle Rechte</Badge>
                                    : rolle.rechte.length === 0
                                        ? <span className="text-xs text-muted-foreground">keine Rechte (nur lesen)</span>
                                        : rolle.rechte.map((r) => <Badge key={r} variant="secondary" title={bezeichnung.get(r)}>{r}</Badge>)}
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button size="icon" variant="ghost" aria-label={`${rolle.name} bearbeiten`} onClick={() => setDialog({ rolle, key: Date.now() })}><Pencil /></Button>
                            {!rolle.system && (
                                <Button size="icon" variant="ghost" aria-label={`${rolle.name} löschen`} onClick={() => loeschen(rolle)}><Trash2 /></Button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
            {dialog && (
                <RolleDialog key={dialog.key} rolle={dialog.rolle} katalog={katalog.data} offen
                    onOffenChange={(auf) => !auf && setDialog(null)} onGespeichert={neuLaden} />
            )}
        </Card>
    );
}
