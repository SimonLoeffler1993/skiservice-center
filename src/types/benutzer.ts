import { z } from "zod";

export const GruppeKurzSchema = z.object({ id: z.number(), name: z.string(), quelle: z.string() });
export type GruppeKurz = z.infer<typeof GruppeKurzSchema>;

export const BenutzerSchema = z.object({
    id: z.number(),
    benutzername: z.string(),
    anzeigename: z.string(),
    email: z.string().nullish(),
    rechte: z.array(z.string()),
    gruppen: z.array(GruppeKurzSchema),
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

export type BenutzerAnlegen = { benutzername: string; anzeigename: string; email?: string | null; gruppen_ids: number[]; passwort: string };
export type BenutzerAendern = Partial<{ anzeigename: string; email: string | null; gruppen_ids: number[]; aktiv: boolean; freigeben: boolean }>;

export const RechtInfoSchema = z.object({ recht: z.string(), bereich: z.string(), bezeichnung: z.string() });
export type RechtInfo = z.infer<typeof RechtInfoSchema>;

export const RolleSchema = z.object({
    id: z.number(),
    name: z.string(),
    beschreibung: z.string().nullish(),
    system: z.boolean(),
    rechte: z.array(z.string()),
    anzahl_gruppen: z.number(),
});
export type Rolle = z.infer<typeof RolleSchema>;
export type RolleDaten = { name?: string; beschreibung?: string | null; rechte?: string[] };

export const GruppeSchema = z.object({
    id: z.number(),
    name: z.string(),
    beschreibung: z.string().nullish(),
    oidc_gruppe: z.string().nullish(),
    rollen: z.array(z.object({ id: z.number(), name: z.string(), system: z.boolean() })),
    anzahl_mitglieder: z.number(),
    // Systemgruppe "Ohne Anmeldung" und ihr Schalter "Alles ansehen"
    gast: z.boolean().default(false),
    lesen: z.boolean().default(false),
});
export type Gruppe = z.infer<typeof GruppeSchema>;
export type GruppeDaten = { name?: string; beschreibung?: string | null; oidc_gruppe?: string | null; rollen_ids?: number[]; lesen?: boolean };

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
    // false = persönliche Anmeldung (endet mit dem Bediener)
    dauerhaft: z.boolean().default(true),
});
export type Geraetesitzung = z.infer<typeof GeraetesitzungSchema>;
