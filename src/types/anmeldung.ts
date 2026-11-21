import { z } from "zod";

export const OidcStatusSchema = z.object({
    aktiv: z.boolean(),
    anbieter: z.string(),
    button_text: z.string(),
});

export const AuthStatusSchema = z.object({
    einrichtung_noetig: z.boolean(),
    anmeldung_erzwungen: z.boolean(),
    geraeteschluessel_erzwungen: z.boolean(),
    pin_erlaubt: z.boolean(),
    oidc: OidcStatusSchema,
    // Was ohne Anmeldung erlaubt ist (Übergang: lesen true, rechte ["*"])
    ohne_anmeldung: z.object({ lesen: z.boolean(), rechte: z.array(z.string()) }),
});
export type AuthStatus = z.infer<typeof AuthStatusSchema>;

export const IchBenutzerSchema = z.object({
    id: z.number(),
    benutzername: z.string(),
    anzeigename: z.string(),
    email: z.string().nullish(),
    // Rechte aus Gruppen -> Rollen, "*" = alle
    rechte: z.array(z.string()),
    gruppen: z.array(z.object({ id: z.number(), name: z.string(), quelle: z.string() })),
    hat_passwort: z.boolean(),
    hat_pin: z.boolean(),
    passwort_aendern: z.boolean(),
    oidc_verknuepft: z.boolean(),
    oidc_veraltet: z.boolean(),
});
export type IchBenutzer = z.infer<typeof IchBenutzerSchema>;

export const IchGeraetSchema = z.object({
    id: z.number(),
    name: z.string(),
    art: z.string(),
    bediener_timeout_minuten: z.number(),
});
export type IchGeraet = z.infer<typeof IchGeraetSchema>;

export const IchSchema = z.object({
    benutzer: IchBenutzerSchema.nullable(),
    geraet: IchGeraetSchema.nullable(),
    methode: z.string().nullish(),
});
export type Ich = z.infer<typeof IchSchema>;

export const AnmeldeAntwortSchema = z.object({
    geraet_token: z.string().nullable(),
    bediener_token: z.string(),
    benutzer: IchBenutzerSchema,
    geraet: IchGeraetSchema,
});

export const KachelSchema = z.object({ id: z.number(), anzeigename: z.string() });
export type Kachel = z.infer<typeof KachelSchema>;

// Fehlercodes der API (detail bzw. ?fehler=) als Text für die Anzeige
const FEHLER_TEXTE: Record<string, string> = {
    falsche_anmeldedaten: "Benutzername, Passwort oder PIN ist falsch.",
    freigabe_ausstehend: "Dein Konto wartet auf die Freigabe durch einen Admin.",
    gesperrt: "Dein Konto ist deaktiviert.",
    pin_aus: "Die Anmeldung mit PIN ist ausgeschaltet.",
    code_ungueltig: "Die Anmeldung ist abgelaufen. Bitte erneut versuchen.",
    oidc_aus: "Die Anmeldung über den Anbieter ist ausgeschaltet.",
    abgebrochen: "Die Anmeldung beim Anbieter wurde abgebrochen.",
    mandant_nicht_erlaubt: "Konten dieser Organisation sind nicht zugelassen.",
    anbieter_nicht_erreichbar: "Der Anmelde-Anbieter ist nicht erreichbar.",
    konfiguration: "Die Anmeldung über den Anbieter ist nicht vollständig eingerichtet.",
    bereits_verknuepft: "Dieses Konto beim Anbieter gehört schon zu einem anderen Benutzer.",
    passwort_falsch: "Das Passwort ist falsch.",
    oidc_erneut_anmelden: "Bitte zuerst erneut über den Anbieter anmelden, dann die PIN festlegen.",
    kein_passwort: "Ohne Passwort kann die Verknüpfung nicht gelöst werden: zuerst ein Passwort festlegen.",
    bereits_eingerichtet: "Die Einrichtung ist schon abgeschlossen.",
    oidc: "Die Anmeldung über den Anbieter ist fehlgeschlagen.",
};

export function fehlerText(code: string | null | undefined, gesperrtBis?: string | null): string {
    if (!code) return "";
    if (code === "gesperrt_bis") {
        const zeit = gesperrtBis ? new Date(gesperrtBis).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }) : null;
        return zeit ? `Zu viele Fehlversuche. Gesperrt bis ${zeit} Uhr.` : "Zu viele Fehlversuche. Bitte später erneut versuchen.";
    }
    return FEHLER_TEXTE[code] ?? code;
}
