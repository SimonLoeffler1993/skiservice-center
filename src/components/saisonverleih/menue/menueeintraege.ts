import {
    CalendarDays, CheckCircle2, ClipboardList, Euro, List, type LucideIcon, Package, Receipt, Settings, Snowflake, Wrench,
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
};

export type MenueGruppe = {
    titel: string;
    links: MenueLink[];
    // Nur in der Navigation, nicht als Kacheln auf der Startseite
    nurNavigation?: boolean;
};

// Gemeinsame Quelle für Navigation (Desktop und Handy) und Startseite
export const MENUE_GRUPPEN: MenueGruppe[] = [
    {
        titel: "Skiservice",
        links: [
            { titel: "Neu", href: "/skiservice/erstellen", icon: Wrench, kachelTitel: "Neuer Auftrag", beschreibung: "Skiservice-Auftrag für einen Kunden erfassen." },
            { titel: "Fertigstellen", href: "/fertig", icon: CheckCircle2, kachelTitel: "Ski fertigmelden", beschreibung: "Ski scannen, fertigmelden und Kunden benachrichtigen.", startseiteUnten: true },
            { titel: "Anzeigen", href: "/skiservice/anzeigen", icon: ClipboardList, kachelTitel: "Alle Aufträge", beschreibung: "Aufträge der Saison ansehen und bearbeiten." },
        ],
    },
    {
        titel: "Saisonverleih",
        links: [
            { titel: "Neu", href: "/saisonverleih/erstellen", icon: Snowflake, kachelTitel: "Neuer Saisonverleih", beschreibung: "Material für die ganze Saison verleihen." },
            { titel: "Anzeigen", href: "/saisonverleih/anzeigen?art=saison", icon: List, kachelTitel: "Saisonverleihe", beschreibung: "Saisonverleihe ansehen, bearbeiten und zurücknehmen." },
        ],
    },
    {
        titel: "Tagesverleih",
        links: [
            { titel: "Neu", href: "/saisonverleih/erstellen?art=tag", icon: CalendarDays, kachelTitel: "Neuer Tagesverleih", beschreibung: "Material für einzelne Tage verleihen." },
            { titel: "Anzeigen", href: "/saisonverleih/anzeigen?art=tag", icon: List, kachelTitel: "Tagesverleihe", beschreibung: "Tagesverleihe ansehen, bearbeiten und zurücknehmen." },
        ],
    },
    {
        titel: "Verwalten",
        nurNavigation: true,
        links: [
            { titel: "Material", href: "/material", icon: Package, kachelTitel: "Material", beschreibung: "Ski, Schuhe, Stöcke, Hersteller und Modelle." },
            { titel: "Preise", href: "/verwalten/preise", icon: Euro, kachelTitel: "Preise", beschreibung: "Preise für Skiservice und Saisonverleih." },
            { titel: "Quittungen", href: "/verwalten/quittungen", icon: Receipt, kachelTitel: "Quittungen", beschreibung: "Alle Quittungen einer Saison." },
            { titel: "Einstellungen", href: "/verwalten/einstellungen", icon: Settings, kachelTitel: "Einstellungen", beschreibung: "Firma, Drucker, E-Mail und Lexware." },
        ],
    },
];
