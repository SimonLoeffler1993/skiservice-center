"use client";

import { Snowflake } from "lucide-react";
import { MaterialRead } from "@/types/materialtypes";
import SaisonVerleiAnzeigeMaterialFahrer from "./MaterialFahrer";
import SaisonVerleiAnzeigeMaterialPreis from "./MaterialPreis";
import SaisonVerleiAnzeigeMaterialSki from "./MaterialSki";
import SaisonVerleiAnzeigeMaterialSchuh from "./MaterialSchuh";
import SaisonVerleiAnzeigeMaterialStock from "./MaterialStock";
import { Card } from "@/components/ui/card";
import ButtonNamenEttiket from "./ButtonNamenEttiket";

type MaterialProps = {
    material: MaterialRead[];
    saisonverleihid: number;
};

export default function SaisonVerleiAnzeigeMaterial({ material, saisonverleihid }: MaterialProps) {

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
                    <ButtonNamenEttiket id={saisonverleihid} />
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
                    </Card>
                ))}
            </div>
        </section>
    );
}