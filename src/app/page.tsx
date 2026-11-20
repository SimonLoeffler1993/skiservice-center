// Seite bei jedem Aufruf rendern, die Saisons selbst kommen aus dem Server Cache
export const dynamic = "force-dynamic";

import Kachel from "@/components/startseite/kachel";
import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";
import { STARTSEITE_LINKS, MENUE_GRUPPEN } from "@/components/saisonverleih/menue/menueeintraege";
import AktuelleSaison from "@/components/saison/AktuelleSaison";
import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import VerbindungsFehler from "@/components/startseite/VerbindungsFehler";
import { getSaisonDaten } from "@/lib/saisonactions";
import { pruefeBackend } from "@/lib/healthactions";

export default async function Home() {

    // Healthcheck nie gecacht: die Saisons liegen im Server Cache und würden einen Ausfall verdecken
    const [zustand, saisonDaten] = await Promise.all([pruefeBackend(), getSaisonDaten()]);

    // API oder Datenbank nicht erreichbar: Fehleransicht statt Startseite
    if (zustand !== "ok") {
        return <VerbindungsFehler zustand={zustand} />;
    }

    // Oben der Schnellzugriff, Einträge mit startseiteUnten abgetrennt darunter
    const gruppen = MENUE_GRUPPEN.filter((gruppe) => !gruppe.nurNavigation);
    const schnellzugriff = gruppen
        .map((gruppe) => ({ ...gruppe, links: gruppe.links.filter((link) => !link.startseiteUnten) }))
        .filter((gruppe) => gruppe.links.length > 0);
    const unten = [...STARTSEITE_LINKS, ...gruppen.flatMap((gruppe) => gruppe.links)].filter((link) => link.startseiteUnten);

    return (
        <div className="container mx-auto p-4 space-y-6">
            <MenueLeiste />

            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Auf dem Handy steht der Name schon in der Menüleiste */}
                <h1 className="hidden text-3xl font-bold md:block">Skiservice Center</h1>
                {saisonDaten.success && saisonDaten.data.aktuelle && (
                    <AktuelleSaison saison={saisonDaten.data.aktuelle} />
                )}
            </div>

            {!saisonDaten.success ? (
                <BackendFehler meldung={saisonDaten.error} />
            ) : !saisonDaten.data.aktuelle ? (
                <KeineSaison />
            ) : (
                <>
                    {/* Schnellzugriff: gleiche Gruppen wie in der Navigation, ohne "Verwalten" */}
                    <div className="space-y-8">
                        {schnellzugriff.map((gruppe) => (
                            <section key={gruppe.titel} className="space-y-3">
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{gruppe.titel}</h2>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {gruppe.links.map((link) => (
                                        <Kachel
                                            key={link.href}
                                            titel={link.kachelTitel}
                                            beschreibung={link.beschreibung}
                                            href={link.href}
                                            icon={link.icon}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    {/* Abgetrennt unten: Werkstatt und Scanner, die nicht in der Navigation stehen */}
                    {unten.length > 0 && (
                        <section className="space-y-3 border-t pt-6">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Werkstatt</h2>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {unten.map((link) => (
                                    <Kachel
                                        key={link.href}
                                        titel={link.kachelTitel}
                                        beschreibung={link.beschreibung}
                                        href={link.href}
                                        icon={link.icon}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
