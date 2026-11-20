"use client";

import { useState } from "react";
import { KeyRound, Link2, Link2Off, LockKeyhole, Trash2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBenutzer } from "@/context/benutzer-context";
import { oidcTrennen, oidcVerknuepfenUrl, passwortAendern, pinLoeschen, pinSetzen } from "@/lib/anmeldungactions";
import type { AuthStatus, IchBenutzer } from "@/types/anmeldung";
import { ApiAntwort } from "@/types/actiontypes";

type Meldung = { art: "ok" | "fehler"; text: string } | null;

function MeldungAnzeige({ meldung }: { meldung: Meldung }) {
    if (!meldung) return null;
    return (
        <Alert variant={meldung.art === "fehler" ? "destructive" : "default"}>
            <AlertDescription>{meldung.text}</AlertDescription>
        </Alert>
    );
}

export default function MeinKonto({ status, pflicht, hinweis }: { status: AuthStatus | null; pflicht: boolean; hinweis: Meldung }) {
    const { benutzer: anfang, aktualisieren } = useBenutzer();
    const [benutzer, setBenutzer] = useState<IchBenutzer | null>(anfang);
    const [pw, setPw] = useState({ alt: "", neu: "", wiederholung: "" });
    const [pwMeldung, setPwMeldung] = useState<Meldung>(null);
    const [pin, setPin] = useState({ passwort: "", pin: "", wiederholung: "" });
    const [pinMeldung, setPinMeldung] = useState<Meldung>(null);
    const [oidcMeldung, setOidcMeldung] = useState<Meldung>(hinweis);
    const [laeuft, setLaeuft] = useState(false);

    if (!benutzer) {
        return <p className="text-muted-foreground">Nicht angemeldet.</p>;
    }

    const ausfuehren = async (aktion: () => Promise<ApiAntwort<IchBenutzer>>, setMeldung: (m: Meldung) => void, ok: string) => {
        setLaeuft(true);
        const antwort = await aktion();
        setLaeuft(false);
        if (!antwort.success) {
            setMeldung({ art: "fehler", text: antwort.error });
            return false;
        }
        setBenutzer(antwort.data);
        setMeldung({ art: "ok", text: ok });
        await aktualisieren();
        return true;
    };

    const passwortSpeichern = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pw.neu !== pw.wiederholung) {
            setPwMeldung({ art: "fehler", text: "Die neuen Passwörter stimmen nicht überein." });
            return;
        }
        const warPflicht = pflicht || benutzer.passwort_aendern;
        const ok = await ausfuehren(() => passwortAendern(benutzer.hat_passwort ? pw.alt : null, pw.neu), setPwMeldung, "Passwort gespeichert.");
        if (ok) {
            setPw({ alt: "", neu: "", wiederholung: "" });
            // Nach dem erzwungenen Wechsel weiter zur Startseite
            if (warPflicht) window.location.href = "/";
        }
    };

    const pinSpeichern = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.pin !== pin.wiederholung) {
            setPinMeldung({ art: "fehler", text: "Die PINs stimmen nicht überein." });
            return;
        }
        const ok = await ausfuehren(() => pinSetzen(benutzer.hat_passwort ? pin.passwort : null, pin.pin), setPinMeldung,
            "PIN gespeichert. Du erscheinst jetzt als Kachel in der Bedienerauswahl.");
        if (ok) setPin({ passwort: "", pin: "", wiederholung: "" });
    };

    const pinEntfernen = async () => {
        if (!window.confirm("PIN löschen? Danach meldest du dich nur noch mit Passwort an.")) return;
        await ausfuehren(pinLoeschen, setPinMeldung, "PIN gelöscht.");
    };

    const verknuepfen = async () => {
        const antwort = await oidcVerknuepfenUrl(`${window.location.origin}/konto`);
        if (!antwort.success) {
            setOidcMeldung({ art: "fehler", text: antwort.error });
            return;
        }
        window.location.href = antwort.data;
    };

    const trennen = async () => {
        if (!window.confirm("Verknüpfung lösen? Danach ist die Anmeldung über den Anbieter nicht mehr möglich.")) return;
        await ausfuehren(oidcTrennen, setOidcMeldung, "Verknüpfung gelöst.");
    };

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {benutzer.passwort_aendern && (
                <Alert className="lg:col-span-2">
                    <LockKeyhole />
                    <AlertTitle>Bitte ein eigenes Passwort festlegen</AlertTitle>
                    <AlertDescription>Das Passwort wurde von einem Admin vergeben und muss jetzt geändert werden.</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Passwort</CardTitle>
                    <CardDescription>
                        {benutzer.hat_passwort ? "Zum Ändern das aktuelle Passwort eingeben." : "Noch kein Passwort: du meldest dich nur über den Anbieter an."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={passwortSpeichern} className="space-y-3">
                        <MeldungAnzeige meldung={pwMeldung} />
                        <input type="text" autoComplete="username" value={benutzer.benutzername} readOnly hidden />
                        {benutzer.hat_passwort && (
                            <div className="space-y-1">
                                <Label htmlFor="pw-alt">Aktuelles Passwort</Label>
                                <Input id="pw-alt" type="password" autoComplete="current-password" required
                                    value={pw.alt} onChange={(e) => setPw({ ...pw, alt: e.target.value })} />
                            </div>
                        )}
                        <div className="space-y-1">
                            <Label htmlFor="pw-neu">Neues Passwort</Label>
                            <Input id="pw-neu" type="password" autoComplete="new-password" required
                                value={pw.neu} onChange={(e) => setPw({ ...pw, neu: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="pw-wdh">Neues Passwort wiederholen</Label>
                            <Input id="pw-wdh" type="password" autoComplete="new-password" required
                                value={pw.wiederholung} onChange={(e) => setPw({ ...pw, wiederholung: e.target.value })} />
                        </div>
                        <Button type="submit" disabled={laeuft}>Passwort speichern</Button>
                    </form>
                </CardContent>
            </Card>

            {status?.pin_erlaubt !== false && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            PIN für die Schnellwahl
                            <Badge variant={benutzer.hat_pin ? "default" : "secondary"}>{benutzer.hat_pin ? "gesetzt" : "keine"}</Badge>
                        </CardTitle>
                        <CardDescription>
                            Freiwillig. Mit PIN erscheinst du als Kachel in der Bedienerauswahl und musst am geteilten Gerät
                            nicht jedes Mal das Passwort eingeben.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={pinSpeichern} className="space-y-3">
                            <MeldungAnzeige meldung={pinMeldung} />
                            {benutzer.hat_passwort && (
                                <div className="space-y-1">
                                    <Label htmlFor="pin-pw">Passwort zur Bestätigung</Label>
                                    <Input id="pin-pw" type="password" autoComplete="current-password" required
                                        value={pin.passwort} onChange={(e) => setPin({ ...pin, passwort: e.target.value })} />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label htmlFor="pin-neu">{benutzer.hat_pin ? "Neue PIN" : "PIN"}</Label>
                                    <Input id="pin-neu" type="password" inputMode="numeric" pattern="\d{4,8}" maxLength={8}
                                        title="4 bis 8 Ziffern" autoComplete="off" required
                                        value={pin.pin} onChange={(e) => setPin({ ...pin, pin: e.target.value.replace(/\D/g, "") })} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="pin-wdh">Wiederholen</Label>
                                    <Input id="pin-wdh" type="password" inputMode="numeric" maxLength={8} autoComplete="off" required
                                        value={pin.wiederholung} onChange={(e) => setPin({ ...pin, wiederholung: e.target.value.replace(/\D/g, "") })} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button type="submit" disabled={laeuft}><KeyRound /> PIN speichern</Button>
                                {benutzer.hat_pin && (
                                    <Button type="button" variant="outline" disabled={laeuft} onClick={pinEntfernen}>
                                        <Trash2 /> PIN löschen
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {(status?.oidc.aktiv || benutzer.oidc_verknuepft) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Anmeldung über den Anbieter
                            {benutzer.oidc_verknuepft && (
                                <Badge variant={benutzer.oidc_veraltet ? "destructive" : "default"}>
                                    {benutzer.oidc_veraltet ? "veraltet" : "verknüpft"}
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {benutzer.oidc_veraltet
                                ? "Die Verknüpfung gehört zu einem früheren Anbieter. Bitte neu verknüpfen."
                                : benutzer.oidc_verknuepft
                                    ? "Du kannst dich auch über den Anbieter anmelden."
                                    : "Verknüpfe dein Konto, um dich über den Anbieter anzumelden."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <MeldungAnzeige meldung={oidcMeldung} />
                        <div className="flex flex-wrap gap-2">
                            {status?.oidc.aktiv && (!benutzer.oidc_verknuepft || benutzer.oidc_veraltet) && (
                                <Button onClick={verknuepfen}><Link2 /> {status.oidc.button_text.replace(/anmelden$/, "verknüpfen")}</Button>
                            )}
                            {benutzer.oidc_verknuepft && (
                                <Button variant="outline" onClick={trennen} disabled={laeuft}><Link2Off /> Verknüpfung lösen</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
