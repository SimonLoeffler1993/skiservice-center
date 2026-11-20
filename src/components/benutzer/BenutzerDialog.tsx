"use client";

import { useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Benutzer, BenutzerAendern, BenutzerAnlegen, Rolle } from "@/types/benutzer";

type BenutzerDialogProps = {
    trigger: ReactNode;
    // Bearbeiten: vorhandener Benutzer, ohne Angabe wird ein neuer angelegt
    benutzer?: Benutzer;
    // Gibt eine Fehlermeldung zurück oder null bei Erfolg
    onAnlegen?: (daten: BenutzerAnlegen) => Promise<string | null>;
    onAendern?: (daten: BenutzerAendern) => Promise<string | null>;
};

/** Benutzer anlegen (mit Startpasswort) oder Name, E-Mail und Rolle ändern. */
export default function BenutzerDialog({ trigger, benutzer, onAnlegen, onAendern }: BenutzerDialogProps) {
    const neu = !benutzer;
    const [offen, setOffen] = useState(false);
    const [werte, setWerte] = useState({ benutzername: "", anzeigename: "", email: "", rolle: "mitarbeiter" as Rolle, passwort: "" });
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    function oeffnen(auf: boolean) {
        if (auf) {
            setWerte({
                benutzername: benutzer?.benutzername ?? "",
                anzeigename: benutzer?.anzeigename ?? "",
                email: benutzer?.email ?? "",
                rolle: benutzer?.rolle ?? "mitarbeiter",
                passwort: "",
            });
            setFehler(null);
        }
        setOffen(auf);
    }

    function speichern(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            const ergebnis = neu
                ? await onAnlegen?.({ ...werte, email: werte.email.trim() || null })
                : await onAendern?.({ anzeigename: werte.anzeigename, email: werte.email.trim() || null, rolle: werte.rolle });
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
                                : "Name, E-Mail und Rolle ändern."}
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
                    <div className="space-y-1">
                        <Label>Rolle</Label>
                        <Select value={werte.rolle} onValueChange={(rolle) => setWerte({ ...werte, rolle: rolle as Rolle })}>
                            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mitarbeiter">Mitarbeiter – Tagesgeschäft</SelectItem>
                                <SelectItem value="admin">Admin – zusätzlich Einstellungen, Preise, Benutzer, Storno</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
