"use client";

import { Snowflake } from "lucide-react";
import { MaterialRead } from "@/types/materialtypes";
import SaisonVerleiAnzeigeMaterialFahrer from "./MaterialFahrer";
import SaisonVerleiAnzeigeMaterialPreis from "./MaterialPreis";
import SaisonVerleiAnzeigeMaterialSki from "./MaterialSki";
import SaisonVerleiAnzeigeMaterialSchuh from "./MaterialSchuh";
import SaisonVerleiAnzeigeMaterialStock from "./MaterialStock";
import { Card } from "@/components/ui/card";
import EtikettenDruckButton from "./EtikettenDruckButton";
import VerleihStatusAktion from "./VerleihStatusAktion";
import { VerleihStatus } from "@/types/saisonverleihtypes";
import MaterialAktionen from "../bearbeiten/MaterialAktionen";
import SaisonVerleiAnzeigeMaterialBindung from "./MaterialBindung";

type MaterialProps = {
    material: MaterialRead[];
    saisonverleihid: number;
    // Mit Angabe werden Bearbeiten-Aktionen je Material angezeigt
    bezahlt?: boolean;
    // Mit Angabe können Bindungsdaten erfasst und bearbeitet werden
    kundeId?: number;
    // Aktueller Status, für Abgeholt / Zurückgegeben
    status?: VerleihStatus;
};

export default function SaisonVerleiAnzeigeMaterial({ material, saisonverleihid, bezahlt, kundeId, status }: MaterialProps) {

    if (material.length === 0) {
        return (
            <section className="space-y-4">
                <p>Kein Material vorhanden</p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Material</h2>
                </div>
                <div className="flex items-center gap-2 self-start">
                    {status && <VerleihStatusAktion verleihId={saisonverleihid} status={status} />}
                    <EtikettenDruckButton verleihId={saisonverleihid} deaktiviert={!material.some((m) => m.skinr || m.schuhnr)} />
                </div>
            </div>


            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {material.map((a) => (
                    <Card key={"material-" + a.ID}>
                        <SaisonVerleiAnzeigeMaterialFahrer material={a} />
                        <SaisonVerleiAnzeigeMaterialPreis material={a} />
                        <SaisonVerleiAnzeigeMaterialSki material={a} />
                        <SaisonVerleiAnzeigeMaterialSchuh material={a} />
                        <SaisonVerleiAnzeigeMaterialStock material={a} />
                        {kundeId !== undefined ? (
                            <SaisonVerleiAnzeigeMaterialBindung verleihId={saisonverleihid} material={a} kundeId={kundeId}>
                                <MaterialEtiketten verleihId={saisonverleihid} material={a} />
                            </SaisonVerleiAnzeigeMaterialBindung>
                        ) : (
                            <div className="m-2 mb-0"><MaterialEtiketten verleihId={saisonverleihid} material={a} /></div>
                        )}
                        {bezahlt !== undefined && (
                            <MaterialAktionen
                                verleihId={saisonverleihid}
                                material={a}
                                bezahlt={bezahlt}
                                letztesMaterial={material.length === 1}
                            />
                        )}
                    </Card>
                ))}
            </div>
        </section>
    );
}
// Etiketten nur für Ski und Schuh dieser Materialzeile
function MaterialEtiketten({ verleihId, material }: { verleihId: number; material: MaterialRead }) {
    return (
        <EtikettenDruckButton
            verleihId={verleihId}
            materialId={material.ID}
            beschriftung="Etiketten"
            deaktiviert={!material.skinr && !material.schuhnr}
        />
    );
}
