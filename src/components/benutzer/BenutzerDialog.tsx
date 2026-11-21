"use client";

import { useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Benutzer, BenutzerAendern, BenutzerAnlegen, Gruppe } from "@/types/benutzer";

type BenutzerDialogProps = {
    trigger: ReactNode;
    // Bearbeiten: vorhandener Benutzer, ohne Angabe wird ein neuer angelegt
    benutzer?: Benutzer;
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onAnlegen?: (daten: BenutzerAnlegen) => Promise<string | null>;
    onAendern?: (daten: BenutzerAendern) => Promise<string | null>;
    // Alle Gruppen zur Auswahl
    gruppen: Gruppe[];
};

/** Benutzer anlegen (mit Startpasswort) oder Name, E-Mail und Rolle ändern. */
export default function BenutzerDialog({ trigger, benutzer, onAnlegen, onAendern, gruppen }: BenutzerDialogProps) {
    const neu = !benutzer;
    const [offen, setOffen] = useState(false);
    const [werte, setWerte] = useState({ benutzername: "", anzeigename: "", email: "", passwort: "" });
    // Manuelle Mitgliedschaften; über OIDC gekommene steuert der Anbieter
    const [gruppenIds, setGruppenIds] = useState<Set<number>>(new Set());
    const oidcGruppen = new Set(benutzer?.gruppen.filter((g) => g.quelle === "oidc").map((g) => g.id) ?? []);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function oeffnen(auf: boolean) {
        if (auf) {
            setWerte({
                benutzername: benutzer?.benutzername ?? "",
                anzeigename: benutzer?.anzeigename ?? "",
                email: benutzer?.email ?? "",
                passwort: "",
            });
            setGruppenIds(new Set(
                benutzer
                    ? benutzer.gruppen.filter((g) => g.quelle !== "oidc").map((g) => g.id)
                    : gruppen.filter((g) => g.name === "Mitarbeiter").map((g) => g.id),
            ));
            setFehler(null);
        }
        setOffen(auf);
    }

    function speichern(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const ergebnis = neu
                ? await onAnlegen?.({ ...werte, email: werte.email.trim() || null, gruppen_ids: [...gruppenIds] })
                : await onAendern?.({ anzeigename: werte.anzeigename, email: werte.email.trim() || null, gruppen_ids: [...gruppenIds] });
            if (ergebnis) setFehler(ergebnis);
            else setOffen(false);
        });
    }

    return (
        <Dialog open={offen} onOpenChange={oeffnen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <form onSubmit={speichern} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{neu ? "Neuer Benutzer" : `${benutzer.anzeigename} bearbeiten`}</DialogTitle>
                        <DialogDescription>
                            {neu
                                ? "Das Startpasswort muss bei der ersten Anmeldung geändert werden. Eine PIN legt jeder selbst unter „Mein Konto“ fest."
                                : "Name, E-Mail und Gruppen ändern. Gruppen „über OIDC“ steuert der Anmelde-Anbieter."}
                        </DialogDescription>
                    </DialogHeader>
                    {neu && (
                        <div className="space-y-1">
                            <Label htmlFor="b-name">Benutzername</Label>
                            <Input id="b-name" autoCapitalize="none" pattern="[A-Za-z0-9._@\-]{2,50}" title="2 bis 50 Zeichen: Buchstaben, Ziffern, . _ @ -"
                                required value={werte.benutzername} onChange={(e) => setWerte({ ...werte, benutzername: e.target.value })} />
                        </div>
                    )}
                    <div className="space-y-1">
                        <Label htmlFor="b-anzeige">Name (auf Kachel und im Verlauf)</Label>
                        <Input id="b-anzeige" required maxLength={100} value={werte.anzeigename}
                            onChange={(e) => setWerte({ ...werte, anzeigename: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="b-email">E-Mail (optional)</Label>
                        <Input id="b-email" type="email" maxLength={255} value={werte.email}
                            onChange={(e) => setWerte({ ...werte, email: e.target.value })} />
                    </div>
                    <fieldset className="space-y-2 rounded-md border p-3">
                        <legend className="px-1 text-sm font-medium">Gruppen</legend>
                        {gruppen.map((g) => (
                            <label key={g.id} className="flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={oidcGruppen.has(g.id) || gruppenIds.has(g.id)}
                                    disabled={oidcGruppen.has(g.id)}
                                    onCheckedChange={(wert) => {
                                        const neu = new Set(gruppenIds);
                                        if (wert === true) neu.add(g.id);
                                        else neu.delete(g.id);
                                        setGruppenIds(neu);
                                    }}
                                />
                                <span>{g.name}</span>
                                {oidcGruppen.has(g.id) && <Badge variant="outline">über OIDC</Badge>}
                                {g.rollen.length > 0 && <span className="text-xs text-muted-foreground">{g.rollen.map((r) => r.name).join(", ")}</span>}
                            </label>
                        ))}
                    </fieldset>
                    {neu && (
                        <div className="space-y-1">
                            <Label htmlFor="b-pw">Startpasswort</Label>
                            <Input id="b-pw" type="text" autoComplete="off" required value={werte.passwort}
                                onChange={(e) => setWerte({ ...werte, passwort: e.target.value })} />
                        </div>
                    )}
                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>{isPending ? "Speichere…" : "Speichern"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
