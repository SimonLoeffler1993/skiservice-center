import { BadgeCheck, Snowflake, Wrench } from "lucide-react";

import type { WerkstattAuswertung as Auswertung } from "@/types/werkstatttypes";
import KennzahlKachel, { KennzahlZeile } from "./KennzahlKachel";

const RASTER = "grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-3";

// Auswertung Skiservice: wie viele Ski eingestellt wurden und wie viele einen Service bekommen haben
export function ServiceAuswertung({ auswertung }: { auswertung: Auswertung }) {
    const { eingestellt_service: eingestellt, service_fertig: fertig } = auswertung;

    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Auswertung</h2>
            <div className={RASTER}>
                <KennzahlKachel titel="Eingestellt" icon={BadgeCheck} wert={eingestellt.heute} einheit="heute">
                    <KennzahlZeile text="Letzte 7 Tage" wert={eingestellt.woche} />
                    <KennzahlZeile text="Saison" wert={eingestellt.saison} />
                </KennzahlKachel>

                <KennzahlKachel titel="Service fertig" icon={Wrench} wert={fertig.heute} einheit="heute">
                    <KennzahlZeile text="Letzte 7 Tage" wert={fertig.woche} />
                    <KennzahlZeile text="Saison" wert={fertig.saison} />
                </KennzahlKachel>

                <KennzahlKachel
                    titel="Skiservice in der Saison"
                    icon={Wrench}
                    wert={auswertung.ski_gesamt}
                    einheit="Ski"
                    fortschritt={{ erledigt: fertig.saison, gesamt: auswertung.ski_gesamt }}
                    className="sm:col-span-2 xl:col-span-1"
                >
                    <KennzahlZeile text="Service fertig" wert={fertig.saison} />
                    <KennzahlZeile text="Mit Bindungscheck" wert={auswertung.bindung_gesamt} />
                    <KennzahlZeile text="Davon eingestellt" wert={eingestellt.saison} />
                </KennzahlKachel>
            </div>
        </section>
    );
}

// Auswertung Verleih: geprüfte Bindungen
export function VerleihAuswertung({ auswertung }: { auswertung: Auswertung }) {
    const geprueft = auswertung.eingestellt_verleih;

    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Auswertung</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
                <KennzahlKachel titel="Bindung geprüft" icon={BadgeCheck} wert={geprueft.heute} einheit="heute">
                    <KennzahlZeile text="Letzte 7 Tage" wert={geprueft.woche} />
                    <KennzahlZeile text="Saison" wert={geprueft.saison} />
                </KennzahlKachel>

                <KennzahlKachel
                    titel="Verleih in der Saison"
                    icon={Snowflake}
                    wert={auswertung.verleih_material_gesamt}
                    einheit="Ausrüstungen"
                    fortschritt={{ erledigt: geprueft.saison, gesamt: auswertung.verleih_material_gesamt }}
                    balken="bg-teal-600"
                >
                    <KennzahlZeile text="Bindung geprüft" wert={geprueft.saison} />
                    <KennzahlZeile text="Noch zu prüfen" wert={auswertung.verleih_bindung_offen} />
                </KennzahlKachel>
            </div>
        </section>
    );
}
