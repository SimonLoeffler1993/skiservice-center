export type MenueGruppe = {
    titel: string;
    links: { titel: string; href: string }[];
};

export const MENUE_GRUPPEN: MenueGruppe[] = [
    {
        titel: "Saisonverleih",
        links: [
            { titel: "Anzeigen", href: "/saisonverleih/anzeigen" },
            { titel: "Neu", href: "/saisonverleih/erstellen" },
        ],
    },
    {
        titel: "Skiservice",
        links: [
            { titel: "Anzeigen", href: "/skiservice/anzeigen" },
            { titel: "Neu", href: "/skiservice/erstellen" },
            { titel: "Fertigstellen", href: "/fertig" },
        ],
    },
    {
        titel: "Verwalten",
        links: [
            { titel: "Material", href: "/material" },
            { titel: "Preise", href: "/verwalten/preise" },
            { titel: "Einstellungen", href: "/verwalten/einstellungen" },
        ],
    },
];
