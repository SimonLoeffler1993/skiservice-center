"use client";

import { useState, useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Pencil, Plus, Trash2, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gruppenOptions, rollenOptions } from "@/hooks/useBenutzerOptions";
import { holeStatus } from "@/lib/anmeldungactions";
import { aendereGruppe, legeGruppeAn, loescheGruppe } from "@/lib/rechteactions";
import type { Gruppe, Rolle } from "@/types/benutzer";

// Rollen, die die Gruppe "Ohne Anmeldung" nie bekommen darf (sonst könnte sich jeder zum Admin machen)
const fuerGastGesperrt = (r: Rolle) => r.system || r.rechte.includes("*") || r.rechte.includes("benutzer.verwalten");

function GruppeDialog({ gruppe, rollen, oidcAktiv, onSchliessen, onGespeichert }: {
    gruppe: Gruppe | null;
    rollen: Rolle[];
    oidcAktiv: boolean;
    onSchliessen: () => void;
    onGespeichert: () => void;
}) {
    const [name, setName] = useState(gruppe?.name ?? "");
    const [beschreibung, setBeschreibung] = useState(gruppe?.beschreibung ?? "");
    const [oidcGruppe, setOidcGruppe] = useState(gruppe?.oidc_gruppe ?? "");
    const [rollenIds, setRollenIds] = useState<Set<number>>(new Set(gruppe?.rollen.map((r) => r.id) ?? []));
    const [lesen, setLesen] = useState(gruppe?.lesen ?? false);
    const gast = gruppe?.gast ?? false;
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const speichern = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const daten = gast
                ? { beschreibung, rollen_ids: [...rollenIds], lesen }
                : { name, beschreibung, oidc_gruppe: oidcGruppe.trim() || null, rollen_ids: [...rollenIds] };
            const antwort = gruppe ? await aendereGruppe(gruppe.id, daten) : await legeGruppeAn(daten);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            onGespeichert();
            onSchliessen();
        });
    };

    return (
        <Dialog open onOpenChange={(auf) => !auf && onSchliessen()}>
            <DialogContent className="max-h-[90svh] overflow-y-auto">
                <form onSubmit={speichern} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{gruppe ? `Gruppe ${gruppe.name}` : "Neue Gruppe"}</DialogTitle>
                        <DialogDescription>
                            {gast
                                ? "Gilt für alle, die das Center oder die Kasse ohne Anmeldung öffnen – also jeden im Netz, der die Adresse kennt. Wirkt erst, wenn die Anmeldung erzwungen wird."
                                : "Mitglieder bekommen die Rechte aller Rollen der Gruppe."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-1">
                        <Label htmlFor="g-name">Name</Label>
                        <Input id="g-name" required maxLength={100} value={name} disabled={gast} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="g-beschreibung">Beschreibung</Label>
                        <Input id="g-beschreibung" maxLength={255} value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} />
                    </div>
                    {gast ? (
                        <label className="flex items-start gap-2 rounded-md border p-3 text-sm">
                            <Checkbox checked={lesen} onCheckedChange={(wert) => setLesen(wert === true)} className="mt-0.5" />
                            <span>
                                <span className="font-medium">Alles ansehen</span>
                                <span className="block text-muted-foreground">
                                    Aufträge, Verleihe, Kunden, Quittungen, Material und Werkstatt ohne Anmeldung ansehen.
                                    Ohne diesen Haken gelten nur die Rechte der Rollen (z.B. Kasse bedienen).
                                </span>
                            </span>
                        </label>
                    ) : (
                    <div className="space-y-1">
                        <Label htmlFor="g-oidc">OIDC-Gruppe</Label>
                        <Input id="g-oidc" maxLength={255} placeholder="z.B. ski-werkstatt" value={oidcGruppe} onChange={(e) => setOidcGruppe(e.target.value)} />
                        <p className="text-xs text-muted-foreground">
                            Name der Gruppe beim Anmelde-Anbieter (bei Microsoft die Object-ID). Wer sich über OIDC anmeldet und in dieser
                            Gruppe ist, wird automatisch Mitglied und freigegeben; fehlt die Gruppe beim nächsten Login, endet die Mitgliedschaft.
                            {!oidcAktiv && " Die Anmeldung mit OIDC ist derzeit ausgeschaltet."}
                        </p>
                    </div>
                    )}
                    <fieldset className="space-y-2 rounded-md border p-3">
                        <legend className="px-1 text-sm font-medium">Rollen</legend>
                        {rollen.map((r) => (
                            <label key={r.id} className="flex items-center gap-2 text-sm"
                                title={gast && fuerGastGesperrt(r) ? "Ohne Anmeldung nicht erlaubt: alle Rechte bzw. Benutzer verwalten" : undefined}>
                                <Checkbox
                                    disabled={gast && fuerGastGesperrt(r) && !rollenIds.has(r.id)}
                                    checked={rollenIds.has(r.id)}
                                    onCheckedChange={(wert) => {
                                        const neu = new Set(rollenIds);
                                        if (wert === true) neu.add(r.id);
                                        else neu.delete(r.id);
                                        setRollenIds(neu);
                                    }}
                                />
                                <span className={gast && fuerGastGesperrt(r) ? "text-muted-foreground" : undefined}>
                                    {r.name}{r.system && <span className="text-muted-foreground"> (alle Rechte)</span>}
                                    {gast && fuerGastGesperrt(r) && !r.system && <span className="text-muted-foreground"> (Benutzer verwalten, ohne Anmeldung gesperrt)</span>}
                                </span>
                            </label>
                        ))}
                    </fieldset>
                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>{isPending ? "Speichere…" : "Speichern"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function GruppenVerwaltung() {
    const { data: gruppen } = useQuery(gruppenOptions);
    const { data: rollen } = useQuery(rollenOptions);
    const { data: status } = useQuery({ queryKey: ["authStatus"], queryFn: holeStatus, staleTime: 60_000 });
    const queryClient = useQueryClient();
    const [dialog, setDialog] = useState<{ gruppe: Gruppe | null; key: number } | null>(null);
    const [meldung, setMeldung] = useState<string | null>(null);

    const neuLaden = () => {
        queryClient.invalidateQueries({ queryKey: ["gruppen"] });
        queryClient.invalidateQueries({ queryKey: ["rollen"] });
        queryClient.invalidateQueries({ queryKey: ["benutzer"] });
    };

    if (!gruppen || !rollen) return <p>Gruppen werden geladen…</p>;
    if (!gruppen.success || !rollen.success) return <p>{!gruppen.success ? gruppen.error : !rollen.success ? rollen.error : ""}</p>;
    const oidcAktiv = Boolean(status?.success && status.data.oidc.aktiv);
    const erzwungen = Boolean(status?.success && status.data.anmeldung_erzwungen);

    const loeschen = async (gruppe: Gruppe) => {
        if (!window.confirm(`Gruppe „${gruppe.name}“ löschen? Die ${gruppe.anzahl_mitglieder} Mitglieder verlieren ihre Rechte aus dieser Gruppe.`)) return;
        const antwort = await loescheGruppe(gruppe.id);
        setMeldung(antwort.success ? null : antwort.error);
        neuLaden();
    };

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><UsersRound className="size-5" /> Gruppen ({gruppen.data.length})</CardTitle>
                    <CardDescription>Benutzer sind Mitglied in Gruppen, Gruppen bekommen Rollen. Optional mit einer Gruppe des OIDC-Anbieters verknüpft.</CardDescription>
                </div>
                <Button onClick={() => setDialog({ gruppe: null, key: Date.now() })}><Plus /> Neue Gruppe</Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {meldung && <p className="text-sm text-destructive">{meldung}</p>}
                {gruppen.data.map((gruppe) => (
                    <div key={gruppe.id} className={`flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-start sm:justify-between ${gruppe.gast ? "border-dashed bg-muted/30" : ""}`}>
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">{gruppe.name}</span>
                                {gruppe.gast ? (
                                    <>
                                        <Badge variant="outline">System</Badge>
                                        <Badge variant={gruppe.lesen ? "default" : "secondary"}>{gruppe.lesen ? "alles ansehen" : "nichts ansehen"}</Badge>
                                        {!erzwungen && <span className="text-xs text-muted-foreground">wirkt erst, wenn die Anmeldung erzwungen wird (bis dahin ist ohne Anmeldung alles erlaubt)</span>}
                                    </>
                                ) : (
                                    <span className="text-xs text-muted-foreground">{gruppe.anzahl_mitglieder} Mitglied(er)</span>
                                )}
                                {gruppe.oidc_gruppe && (
                                    <Badge variant="outline" title="Gruppe beim OIDC-Anbieter"><KeyRound className="size-3" /> {gruppe.oidc_gruppe}</Badge>
                                )}
                            </div>
                            {gruppe.beschreibung && <p className="text-sm text-muted-foreground">{gruppe.beschreibung}</p>}
                            <div className="flex flex-wrap gap-1">
                                {gruppe.rollen.length === 0
                                    ? <span className="text-xs text-muted-foreground">keine Rollen (nur lesen)</span>
                                    : gruppe.rollen.map((r) => <Badge key={r.id} variant={r.system ? "default" : "secondary"}>{r.name}</Badge>)}
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button size="icon" variant="ghost" aria-label={`${gruppe.name} bearbeiten`} onClick={() => setDialog({ gruppe, key: Date.now() })}><Pencil /></Button>
                            {!gruppe.gast && (
                                <Button size="icon" variant="ghost" aria-label={`${gruppe.name} löschen`} onClick={() => loeschen(gruppe)}><Trash2 /></Button>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
            {dialog && (
                <GruppeDialog key={dialog.key} gruppe={dialog.gruppe} rollen={rollen.data} oidcAktiv={oidcAktiv}
                    onSchliessen={() => setDialog(null)} onGespeichert={neuLaden} />
            )}
        </Card>
    );
}
