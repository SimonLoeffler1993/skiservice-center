"use client";

import { Footprints, MountainSnow, Package, Ruler, ScanLine, Slash, User, type LucideIcon } from "lucide-react";

import { HERVORGEHOBEN_KLASSE, useHervorheben } from "@/hooks/useHervorheben";
import { cn, euro } from "@/lib/utils";
import { bindungsdatenText } from "@/types/bindungsdatentypes";
import { MaterialRead } from "@/types/materialtypes";
import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import MaterialAktionen from "../bearbeiten/MaterialAktionen";
import EtikettenDruckButton from "./EtikettenDruckButton";
import SaisonVerleiAnzeigeMaterialBindung from "./MaterialBindung";
import MaterialBindungPruefen from "./MaterialBindungPruefen";

type MaterialKarteProps = {
    verleih: SaisonverleihRead;
    material: MaterialRead;
    bezahlt: boolean;
    letztesMaterial: boolean;
    // Per QR-Code aufgerufen: hervorheben und hinscrollen
    hervorgehoben?: boolean;
};

// Ski, Schuh oder Stock als eine kompakte Zeile
function Teil({ icon: Icon, titel, name, details }: { icon: LucideIcon; titel: string; name: string; details: (string | number | false | null | undefined)[] }) {
    const text = details.filter(Boolean).join(" · ");
    return (
        <div className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 text-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{titel}</p>
                <p className="font-medium">{name}</p>
                {text && <p className="text-muted-foreground">{text}</p>}
            </div>
        </div>
    );
}

// Eine Materialzeile des Verleihs: Fahrer und Preis, ausgeliehene Teile, Bindungsdaten und Aktionen
export default function MaterialKarte({ verleih, material, bezahlt, letztesMaterial, hervorgehoben = false }: MaterialKarteProps) {
    const verleihId = verleih.ID;
    const ref = useHervorheben<HTMLElement>(hervorgehoben);
    const { Ski, Schuh, Stock } = material;
    const bindung = bindungsdatenText(material.bindungsdaten);

    return (
        <article ref={ref} className={cn("flex flex-col rounded-xl border bg-card", hervorgehoben && HERVORGEHOBEN_KLASSE)}>
            <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
                <p className="flex min-w-0 items-center gap-2 font-semibold">
                    {material.SkiFahrerName ? (
                        <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                        <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="truncate">{material.SkiFahrerName || `Ausrüstung #${material.ID}`}</span>
                    {hervorgehoben && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                            <ScanLine className="h-3 w-3" />
                            Gescannt
                        </span>
                    )}
                </p>
                <div className="-my-1 -mr-2 flex shrink-0 items-center gap-1">
                    <span className="mr-1 font-semibold tabular-nums">{euro.format(material.Preis)}</span>
                    <MaterialAktionen verleih={verleih} material={material} bezahlt={bezahlt} letztesMaterial={letztesMaterial} />
                </div>
            </div>

            <div className="flex-1 space-y-3 px-4 py-3">
                {Ski && (
                    <Teil
                        icon={MountainSnow}
                        titel="Ski"
                        name={`${Ski.Modell.Hersteller.Name} ${Ski.Modell.Modell}`}
                        details={[`${Ski.Laenge} cm`, Ski.Modell.Art.Art, `Nr. ${Ski.SkiNr}`]}
                    />
                )}
                {Schuh && (
                    <Teil
                        icon={Footprints}
                        titel="Schuh"
                        name={`${Schuh.Modell.Hersteller.Name} ${Schuh.Modell.Modell}`}
                        details={[`Gr. ${Schuh.Groese}`, Schuh.Sohle && `Sohle ${Schuh.Sohle} mm`, `Nr. ${Schuh.SchuhNr}`]}
                    />
                )}
                {Stock && (
                    <Teil
                        icon={Slash}
                        titel="Stock"
                        name={Stock.Bezeichnung}
                        details={[material.stocklaenge && `${material.stocklaenge} cm`]}
                    />
                )}
                {!Ski && !Schuh && !Stock && <p className="text-sm text-muted-foreground">Nur Preis, ohne Material</p>}
                {bindung && (
                    <p className="flex items-start gap-3 rounded-md bg-muted/60 px-2 py-1.5 text-sm" title="Bindungsdaten">
                        <Ruler className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        {bindung}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3 [&_button]:h-9">
                <SaisonVerleiAnzeigeMaterialBindung verleihId={verleihId} material={material} kundeId={verleih.Kunde_ID} />
                <MaterialBindungPruefen verleihId={verleihId} material={material} />
                {/* Etiketten nur für Ski und Schuh dieser Materialzeile */}
                <EtikettenDruckButton
                    verleihId={verleihId}
                    materialId={material.ID}
                    beschriftung="Etiketten"
                    deaktiviert={!material.skinr && !material.schuhnr}
                />
            </div>
        </article>
    );
}
