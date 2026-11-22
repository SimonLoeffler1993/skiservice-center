"use client";

import { useState } from "react";
import { KeyRound, LogIn } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useBackendUrl } from "@/context/backend-context";
import { anmelden } from "@/lib/anmeldungactions";
import type { AuthStatus } from "@/types/anmeldung";
import { oidcStartUrl, sicheresZiel } from "./anmeldeziel";

type AnmeldeFormularProps = {
    status: AuthStatus | null;
    zurueck?: string | null;
    // Fehler aus der OIDC-Rückleitung (?fehler=), schon als Text
    fehler?: string | null;
};

/** Benutzername + Passwort (Standard) und, wenn eingerichtet, die Anmeldung über den OIDC-Anbieter. */
export default function AnmeldeFormular({ status, zurueck, fehler: anfangsFehler }: AnmeldeFormularProps) {
    const backendUrl = useBackendUrl();
    const [benutzername, setBenutzername] = useState("");
    const [passwort, setPasswort] = useState("");
    const [fehler, setFehler] = useState<string | null>(anfangsFehler ?? null);
    const [laeuft, setLaeuft] = useState(false);

    const absenden = async (e: React.FormEvent) => {
        e.preventDefault();
        setLaeuft(true);
        setFehler(null);
        const antwort = await anmelden(benutzername.trim(), passwort);
        if (!antwort.success) {
            setFehler(antwort.error);
            setPasswort("");
            setLaeuft(false);
            return;
        }
        // Voller Seitenwechsel: Layout und Menü laden den neuen Bediener
        window.location.href = antwort.data.passwort_aendern ? "/konto?pflicht=1" : sicheresZiel(zurueck);
    };

    const oidcAnmelden = () => {
        window.location.href = oidcStartUrl(backendUrl, zurueck ?? "/");
    };

    return (
        <div className="space-y-4">
            {fehler && (
                <Alert variant="destructive">
                    <AlertDescription>{fehler}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={absenden} className="space-y-3">
                <div className="space-y-1">
                    <Label htmlFor="benutzername">Benutzername</Label>
                    <Input id="benutzername" autoComplete="username" autoCapitalize="none" value={benutzername}
                        onChange={(e) => setBenutzername(e.target.value)} required autoFocus />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="passwort">Passwort</Label>
                    <Input id="passwort" type="password" autoComplete="current-password" value={passwort}
                        onChange={(e) => setPasswort(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={laeuft || !benutzername || !passwort}>
                    <LogIn /> {laeuft ? "Anmelden…" : "Anmelden"}
                </Button>
            </form>
            {status?.oidc.aktiv && (
                <>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Separator className="flex-1" /> oder <Separator className="flex-1" />
                    </div>
                    <Button type="button" variant="outline" className="w-full" onClick={oidcAnmelden}>
                        <KeyRound /> {status.oidc.button_text}
                    </Button>
                </>
            )}
        </div>
    );
}
