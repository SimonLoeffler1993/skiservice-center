// Seite bei jedem Aufruf rendern, die Saisons selbst kommen aus dem Server Cache
export const dynamic = "force-dynamic";

import Kachel from "@/components/startseite/kachel";
import MenueLeiste from "@/components/saisonverleih/menue/MenueLeiste";
import AktuelleSaison from "@/components/saison/AktuelleSaison";
import BackendFehler from "@/components/saison/BackendFehler";
import KeineSaison from "@/components/saison/KeineSaison";
import { getSaisonDaten } from "@/lib/saisonactions";

export default async function Home() {

    const saisonDaten = await getSaisonDaten();

    return (
        <>
            <MenueLeiste />
            <div className="min-h-screen flex flex-col gap-2 items-center justify-center bg-gray-100">
                <h1 className="text-3xl font-bold underline">Skiservice Center</h1>
                {!saisonDaten.success ? (
                    <BackendFehler meldung={saisonDaten.error} />
                ) : !saisonDaten.data.aktuelle ? (
                    <KeineSaison />
                ) : (
                    <>
                        <AktuelleSaison saison={saisonDaten.data.aktuelle} />
                        <h2 className="text-2xl">was soll gemacht werden?</h2>
                        <Kachel title="Saisonverleih" description="Es wird ein Saisonverleih erfasst." href="/saisonverleih/erstellen" buttonText="Erstellen" />
                        <Kachel title="Service" description="Es wird ein Skiservice Auftrag erfasst." href="/skiservice/erstellen" buttonText="Erstellen" />
                        <Kachel title="Service Fertigstellen" description="Skiservice Fertigstellen und Benachrichtigen." href="/fertig" buttonText="Fertigstellen" />
                    </>
                )}
            </div>
        </>
    );
}
