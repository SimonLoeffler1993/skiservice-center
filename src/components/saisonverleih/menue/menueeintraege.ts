import {
    CalendarDays, ClipboardList, Euro, Gauge, KeyRound, List, type LucideIcon, Mail, Package, Receipt, ScanLine, Settings, ShoppingBag, Snowflake, UserCog, Users, Wrench,
} from "lucide-react";

export type MenueLink = {
    // Text im Menü
    titel: string;
    href: string;
    icon: LucideIcon;
    // Titel und Beschreibung der Kachel auf der Startseite
    kachelTitel: string;
    beschreibung: string;
    // Auf der Startseite nicht im Schnellzugriff, sondern abgetrennt ganz unten
    startseiteUnten?: boolean;
    // Nur mit diesem Recht sichtbar (die API prüft zusätzlich)
    recht?: string;
};

export type MenueGruppe = {
    titel: string;
    links: MenueLink[];
    // Nur in der Navigation, nicht als Kacheln auf der Startseite
    nurNavigation?: boolean;
};

// Nur als Kacheln auf der Startseite, nicht in der Navigation (dort stehen nur die Gruppen)
export const STARTSEITE_LINKS: MenueLink[] = [
    { titel: "Werkstatt", href: "/werkstatt", icon: Gauge, kachelTitel: "Werkstatt-Dashboard", beschreibung: "Was noch einzustellen und zu bearbeiten ist, mit Auswertung und Verleih-Übersicht.", startseiteUnten: true },
    { titel: "Scanner", href: "/scanner", icon: ScanLine, kachelTitel: "Scanner", beschreibung: "Etiketten scannen: Ski fertig stellen und Bindungen prüfen.", startseiteUnten: true },
];

// Gemeinsame Quelle für Navigation (Desktop und Handy) und Startseite
export const MENUE_GRUPPEN: MenueGruppe[] = [
    {
        titel: "Skiservice",
        links: [
            { titel: "Neu", recht: "skiservice.anlegen", href: "/skiservice/erstellen", icon: Wrench, kachelTitel: "Neuer Skiservice", beschreibung: "Skiservice-Auftrag für einen Kunden erfassen." },
            { titel: "Anzeigen", href: "/skiservice/anzeigen", icon: ClipboardList, kachelTitel: "Alle Skiservice", beschreibung: "Aufträge der Saison ansehen und bearbeiten." },
        ],
    },
    {
        titel: "Saisonverleih",
        links: [
            { titel: "Neu", recht: "verleih.anlegen", href: "/saisonverleih/erstellen", icon: Snowflake, kachelTitel: "Neuer Saisonverleih", beschreibung: "Material für die ganze Saison verleihen." },
            { titel: "Anzeigen", href: "/saisonverleih/anzeigen?art=saison", icon: List, kachelTitel: "Saisonverleihe", beschreibung: "Saisonverleihe ansehen, bearbeiten und zurücknehmen." },
        ],
    },
    {
        titel: "Tagesverleih",
        links: [
            { titel: "Neu", recht: "verleih.anlegen", href: "/saisonverleih/erstellen?art=tag", icon: CalendarDays, kachelTitel: "Neuer Tagesverleih", beschreibung: "Material für einzelne Tage verleihen." },
            { titel: "Anzeigen", href: "/saisonverleih/anzeigen?art=tag", icon: List, kachelTitel: "Tagesverleihe", beschreibung: "Tagesverleihe ansehen, bearbeiten und zurücknehmen." },
        ],
    },
    {
        titel: "Verwalten",
        nurNavigation: true,
        links: [
            { titel: "Kunden", href: "/kunde", icon: Users, kachelTitel: "Kunden", beschreibung: "Kunden suchen und bearbeiten, mit allen Aufträgen, Verleihen und Quittungen." },
            { titel: "Material", href: "/material", icon: Package, kachelTitel: "Material", beschreibung: "Ski, Schuhe, Stöcke, Hersteller und Modelle." },
            { titel: "Preise", recht: "preise.verwalten", href: "/verwalten/preise", icon: Euro, kachelTitel: "Preise", beschreibung: "Preise für Skiservice und Saisonverleih." },
            { titel: "Handware", recht: "preise.verwalten", href: "/verwalten/handware", icon: ShoppingBag, kachelTitel: "Handware", beschreibung: "Artikel für den Verkauf in der Kasse." },
            { titel: "Quittungen", href: "/verwalten/quittungen", icon: Receipt, kachelTitel: "Quittungen", beschreibung: "Alle Quittungen einer Saison." },
            { titel: "Vorlagen", recht: "vorlagen.verwalten", href: "/verwalten/vorlagen", icon: Mail, kachelTitel: "Vorlagen", beschreibung: "Texte der E-Mails an die Kunden." },
            { titel: "Hardware-Scanner", recht: "geraete.verwalten", href: "/verwalten/scanner", icon: ScanLine, kachelTitel: "Hardware-Scanner", beschreibung: "Alle Scanner mit Firmware und Verbindungsstatus, Firmware aktualisieren." },
            { titel: "Benutzer", recht: "benutzer.verwalten", href: "/verwalten/benutzer", icon: UserCog, kachelTitel: "Benutzer", beschreibung: "Benutzer, Gruppen und Rollen mit ihren Rechten, Freigaben für die OIDC-Anmeldung." },
            { titel: "Geräte", recht: "geraete.verwalten", href: "/verwalten/geraete", icon: KeyRound, kachelTitel: "Geräte", beschreibung: "Geräteschlüssel für Scanner und Kundenterminal, angemeldete Tablets und Kassen." },
            { titel: "Einstellungen", recht: "einstellungen.verwalten", href: "/verwalten/einstellungen", icon: Settings, kachelTitel: "Einstellungen", beschreibung: "Firma, Drucker, E-Mail, Lexware und Scanner." },
        ],
    },
];

/** Menügruppen ohne die Einträge, für die das Recht fehlt. */
export function sichtbareGruppen(darf: (recht: string) => boolean): MenueGruppe[] {
    return MENUE_GRUPPEN
        .map((gruppe) => ({ ...gruppe, links: gruppe.links.filter((link) => !link.recht || darf(link.recht)) }))
        .filter((gruppe) => gruppe.links.length > 0);
}
