"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { einstellungenOptions } from "@/hooks/useEinstellungenOptions";

// Kurzanleitung je Anbieter (OIDC_ANBIETER); die Redirect-URI ist für alle gleich
const ANLEITUNG: Record<string, string[]> = {
    authentik: [
        "Applications → Providers → Create: OAuth2/OpenID Provider, Client type „Confidential“.",
        "Redirect-URI (unten) eintragen, Signing Key wählen (sonst wird mit dem Client-Secret signiert, geht auch).",
        "Eine Application mit diesem Provider anlegen; ihr Slug ergibt den Issuer: https://<host>/application/o/<slug>/",
        "Client-ID und Client-Secret hier eintragen. Wer sich anmelden darf, steuern Bindings an der Application.",
    ],
    microsoft: [
        "Entra ID → App-Registrierungen → Neue Registrierung, Kontotyp „Nur Konten in diesem Organisationsverzeichnis“.",
        "Umleitungs-URI: Plattform „Web“, Redirect-URI (unten) eintragen.",
        "Zertifikate & Geheimnisse → Neuer geheimer Clientschlüssel: der „Wert“ ist das Client-Secret.",
        "Übersicht: „Anwendungs-ID (Client)“ = Client-ID, „Verzeichnis-ID (Mandant)“ = Mandant.",
    ],
    google: [
        "Google Cloud Console → APIs & Dienste → Anmeldedaten → OAuth-Client-ID, Typ „Webanwendung“.",
        "Redirect-URI (unten) unter „Autorisierte Weiterleitungs-URIs“ eintragen.",
        "Client-ID und Client-Secret hier eintragen; der Issuer wird nicht benötigt.",
    ],
    keycloak: [
        "Realm → Clients → Create client (OpenID Connect), Client authentication an.",
        "Redirect-URI (unten) unter „Valid redirect URIs“ eintragen.",
        "Issuer: https://<host>/realms/<realm>, Client-Secret unter „Credentials“.",
    ],
    generisch: [
        "Beim Anbieter einen vertraulichen OIDC-Client (Authorization Code mit PKCE) anlegen.",
        "Redirect-URI (unten) eintragen, Issuer, Client-ID und Client-Secret hier übernehmen.",
    ],
};

// Woher die Gruppen kommen (Claim siehe "Claim mit den Gruppen")
const GRUPPEN_HINWEIS: Record<string, string> = {
    authentik: "Authentik schickt die Gruppen im Claim „groups“ (Scope profile). Als OIDC-Gruppe den Namen der Authentik-Gruppe eintragen.",
    microsoft: "In der App-Registrierung unter Tokenkonfiguration „Gruppenanspruch hinzufügen“ (Sicherheitsgruppen). Entra ID schickt die Object-IDs: diese als OIDC-Gruppe eintragen. Alternativ App-Rollen anlegen und als Claim „roles“ einstellen.",
    google: "Google liefert keine Gruppen; Benutzer werden manuell den Gruppen zugeordnet.",
    keycloak: "Im Client unter Client scopes → dedicated einen Mapper „Group Membership“ mit Token Claim Name „groups“ anlegen (Full group path aus).",
    generisch: "Der Anbieter muss die Gruppen im eingestellten Claim (ID-Token oder userinfo) liefern.",
};

/** Redirect-URI zum Kopieren und Kurzanleitung für den gewählten Anbieter (Reiter „Anmeldung mit OIDC“). */
export default function OidcHilfe() {
    const { data } = useQuery(einstellungenOptions);
    const [kopiert, setKopiert] = useState(false);
    const wert = (schluessel: string) => data?.find((e) => e.schluessel === schluessel)?.wert;
    const adresse = String(wert("OIDC_API_ADRESSE") ?? "").trim().replace(/\/$/, "");
    const anbieter = String(wert("OIDC_ANBIETER") ?? "generisch");
    const redirect = adresse ? `${adresse}/api/v1/auth/oidc/callback` : null;

    const kopieren = async () => {
        if (!redirect) return;
        try {
            await navigator.clipboard.writeText(redirect);
            setKopiert(true);
        } catch {
            // ohne HTTPS keine Zwischenablage: Text ist markierbar
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Einrichtung beim Anbieter</CardTitle>
                <CardDescription>
                    Nach dem ersten Anmelden wartet jede Person auf die Freigabe unter Verwalten → Benutzer (außer „automatisch freigeben“ ist an).
                    Zusätzlich müssen unter „Benutzer &amp; Anmeldung“ die Adressen von Center und Kasse eingetragen sein.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-1">
                    <p className="text-sm font-medium">Redirect-URI</p>
                    {redirect ? (
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <code className="select-all break-all rounded bg-muted px-2 py-1 text-sm">{redirect}</code>
                            <Button size="sm" variant="outline" onClick={kopieren}><Copy /> {kopiert ? "Kopiert" : "Kopieren"}</Button>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Erst „Öffentliche Adresse der API“ eintragen und speichern.</p>
                    )}
                </div>
                <ol className="list-decimal space-y-1 pl-5 text-sm">
                    {(ANLEITUNG[anbieter] ?? ANLEITUNG.generisch).map((schritt) => <li key={schritt}>{schritt}</li>)}
                </ol>
                <div className="space-y-1 border-t pt-3">
                    <p className="text-sm font-medium">Gruppen zuordnen</p>
                    <p className="text-sm text-muted-foreground">{GRUPPEN_HINWEIS[anbieter] ?? GRUPPEN_HINWEIS.generisch}</p>
                    <p className="text-sm text-muted-foreground">
                        Unter Verwalten → Benutzer → Gruppen bei jeder Gruppe den Gruppennamen des Anbieters eintragen. Mitglieder werden bei
                        jeder Anmeldung abgeglichen und automatisch freigegeben.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
