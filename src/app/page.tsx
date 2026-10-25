// Seite bei jedem Aufruf rendern, die Saisons selbst kommen aus dem Server Cache
export const dynamic = "force-dynamic";

import Kachel from "@/components/startseite/kachel";
import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";
import { DIREKT_LINKS, MENUE_GRUPPEN } from "@/components/saisonverleih/menue/menueeintraege";
import AktuelleSaison from "@/components/saison/AktuelleSaison";
import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import { getSaisonDaten } from "@/lib/saisonactions";

export default async function Home() {

    const saisonDaten = await getSaisonDaten();

    // Oben der Schnellzugriff, Einträge mit startseiteUnten abgetrennt darunter
    const gruppen = MENUE_GRUPPEN.filter((gruppe) => !gruppe.nurNavigation);
    const schnellzugriff = gruppen
        .map((gruppe) => ({ ...gruppe, links: gruppe.links.filter((link) => !link.startseiteUnten) }))
        .filter((gruppe) => gruppe.links.length > 0);
    const unten = [...DIREKT_LINKS, ...gruppen.flatMap((gruppe) => gruppe.links)].filter((link) => link.startseiteUnten);

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

                    {/* Abgetrennt unten, z.B. der Scanner in der Werkstatt */}
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
