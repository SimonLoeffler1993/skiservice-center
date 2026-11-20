import { z } from "zod";

export const RolleSchema = z.enum(["admin", "mitarbeiter"]);
export type Rolle = z.infer<typeof RolleSchema>;

export const BenutzerSchema = z.object({
    id: z.number(),
    benutzername: z.string(),
    anzeigename: z.string(),
    email: z.string().nullish(),
    rolle: RolleSchema,
    aktiv: z.boolean(),
    freigabe_ausstehend: z.boolean(),
    hat_passwort: z.boolean(),
    hat_pin: z.boolean(),
    passwort_aendern: z.boolean(),
    oidc_verknuepft: z.boolean(),
    oidc_veraltet: z.boolean(),
    gesperrt_bis: z.string().nullish(),
    angelegt_am: z.string(),
    letzte_anmeldung: z.string().nullish(),
});
export type Benutzer = z.infer<typeof BenutzerSchema>;
export const BenutzerListeSchema = z.array(BenutzerSchema);

export type BenutzerAnlegen = { benutzername: string; anzeigename: string; email?: string | null; rolle: Rolle; passwort: string };
export type BenutzerAendern = Partial<{ anzeigename: string; email: string | null; rolle: Rolle; aktiv: boolean; freigeben: boolean }>;

export const GeraeteschluesselSchema = z.object({
    id: z.number(),
    name: z.string(),
    bereich: z.enum(["scanner", "terminal"]),
    praefix: z.string(),
    aktiv: z.boolean(),
    erstellt_am: z.string(),
    zuletzt_benutzt: z.string().nullish(),
});
export type Geraeteschluessel = z.infer<typeof GeraeteschluesselSchema>;
export const GeraeteschluesselErzeugtSchema = GeraeteschluesselSchema.extend({ schluessel: z.string() });

export const GeraetesitzungSchema = z.object({
    id: z.number(),
    name: z.string(),
    art: z.string(),
    angemeldet_von: z.string().nullish(),
    bediener: z.string().nullish(),
    erstellt_am: z.string(),
    zuletzt_gesehen: z.string(),
    laeuft_ab: z.string(),
    bediener_timeout_minuten: z.number().nullish(),
});
export type Geraetesitzung = z.infer<typeof GeraetesitzungSchema>;
