"use client";

import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { einrichten } from "@/lib/anmeldungactions";

/** Legt den ersten Admin an (nur solange es noch keinen Benutzer gibt). */
export default function EinrichtungFormular() {
    const [werte, setWerte] = useState({ benutzername: "", anzeigename: "", passwort: "", wiederholung: "" });
    const [fehler, setFehler] = useState<string | null>(null);
    const [laeuft, setLaeuft] = useState(false);

    const feld = (name: keyof typeof werte) => ({
        value: werte[name],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setWerte((w) => ({ ...w, [name]: e.target.value })),
    });

    const absenden = async (e: React.FormEvent) => {
        e.preventDefault();
        if (werte.passwort !== werte.wiederholung) {
            setFehler("Die Passwörter stimmen nicht überein.");
            return;
        }
        setLaeuft(true);
        setFehler(null);
        const antwort = await einrichten(werte);
        if (!antwort.success) {
            setFehler(antwort.error);
            setLaeuft(false);
            return;
        }
        window.location.href = "/verwalten/benutzer";
    };

    return (
        <form onSubmit={absenden} className="space-y-3">
            {fehler && (
                <Alert variant="destructive">
                    <AlertDescription>{fehler}</AlertDescription>
                </Alert>
            )}
            <div className="space-y-1">
                <Label htmlFor="e-benutzername">Benutzername</Label>
                <Input id="e-benutzername" autoComplete="username" autoCapitalize="none" pattern="[A-Za-z0-9._@\-]{2,50}"
                    title="2 bis 50 Zeichen: Buchstaben, Ziffern, . _ @ -" required autoFocus {...feld("benutzername")} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="e-anzeigename">Name</Label>
                <Input id="e-anzeigename" placeholder="z.B. Simon" required {...feld("anzeigename")} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="e-passwort">Passwort</Label>
                <Input id="e-passwort" type="password" autoComplete="new-password" required {...feld("passwort")} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="e-wiederholung">Passwort wiederholen</Label>
                <Input id="e-wiederholung" type="password" autoComplete="new-password" required {...feld("wiederholung")} />
            </div>
            <Button type="submit" className="w-full" disabled={laeuft}>
                {laeuft ? "Wird eingerichtet…" : "Admin anlegen und anmelden"}
            </Button>
        </form>
    );
}
