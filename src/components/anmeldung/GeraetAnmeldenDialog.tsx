"use client";

import { useState } from "react";
import { KeyRound, MonitorSmartphone } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBenutzer } from "@/context/benutzer-context";
import { geraetDauerhaftAnmelden, geraetOidcUrl } from "@/lib/anmeldungactions";

/**
 * Macht die persönliche Anmeldung an diesem Gerät dauerhaft (Recht „Gerät anmelden“).
 * Bestätigt mit dem Passwort; Benutzer ohne Passwort bestätigen über den OIDC-Anbieter.
 */
export default function GeraetAnmeldenDialog({ offen, onOffen, oidcText }: {
    offen: boolean;
    onOffen: (offen: boolean) => void;
    // Beschriftung des Anbieters, null = OIDC aus
    oidcText: string | null;
}) {
    const { benutzer, geraet } = useBenutzer();
    const [name, setName] = useState(geraet?.name ?? "");
    const [passwort, setPasswort] = useState("");
    const [fehler, setFehler] = useState<string | null>(null);
    const [laeuft, setLaeuft] = useState(false);
    const mitPasswort = benutzer?.hat_passwort ?? true;

    const absenden = async (e: React.FormEvent) => {
        e.preventDefault();
        setLaeuft(true);
        setFehler(null);
        const antwort = await geraetDauerhaftAnmelden(passwort, name);
        if (!antwort.success) {
            setFehler(antwort.error);
            setPasswort("");
            setLaeuft(false);
            return;
        }
        // Voller Seitenwechsel: Menü und Inaktivitäts-Logik kennen danach das dauerhafte Gerät
        window.location.reload();
    };

    const mitAnbieter = async () => {
        setLaeuft(true);
        setFehler(null);
        const antwort = await geraetOidcUrl(`${window.location.origin}/konto`, name);
        if (!antwort.success) {
            setFehler(antwort.error);
            setLaeuft(false);
            return;
        }
        window.location.href = antwort.data;
    };

    return (
        <Dialog open={offen} onOpenChange={onOffen}>
            <DialogContent>
                <form onSubmit={absenden} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><MonitorSmartphone className="size-5" /> Gerät anmelden</DialogTitle>
                        <DialogDescription>
                            Das Gerät bleibt danach angemeldet. Wer sich abmeldet oder zu lange nichts tut, landet bei der
                            Bedienerauswahl, dort melden sich die Mitarbeiter mit Passwort oder ihrer PIN an.
                        </DialogDescription>
                    </DialogHeader>
                    {fehler && (
                        <Alert variant="destructive">
                            <AlertDescription>{fehler}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-1">
                        <Label htmlFor="geraet-name">Gerätename (optional)</Label>
                        <Input id="geraet-name" maxLength={100} placeholder="z.B. Tablet Werkstatt" value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                    {mitPasswort ? (
                        <div className="space-y-1">
                            <Label htmlFor="geraet-passwort">Dein Passwort zur Bestätigung</Label>
                            <Input id="geraet-passwort" type="password" autoComplete="current-password" required
                                value={passwort} onChange={(e) => setPasswort(e.target.value)} />
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {oidcText
                                ? "Dein Konto hat kein Passwort. Zur Bestätigung meldest du dich kurz erneut beim Anbieter an."
                                : "Dein Konto hat kein Passwort. Lege unter „Mein Konto“ eines fest, um Geräte anzumelden."}
                        </p>
                    )}
                    <DialogFooter>
                        {mitPasswort ? (
                            <Button type="submit" disabled={laeuft || !passwort}>{laeuft ? "Wird angemeldet…" : "Gerät anmelden"}</Button>
                        ) : oidcText && (
                            <Button type="button" disabled={laeuft} onClick={mitAnbieter}><KeyRound /> {oidcText}</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
