"use client";

import { Snowflake } from "lucide-react";

import { MaterialRead } from "@/types/materialtypes";
import MaterialKarte from "./MaterialKarte";

type MaterialProps = {
    material: MaterialRead[];
    saisonverleihid: number;
    bezahlt: boolean;
    // Für Vorschläge beim Erfassen der Bindungsdaten
    kundeId: number;
};

export default function SaisonVerleiAnzeigeMaterial({ material, saisonverleihid, bezahlt, kundeId }: MaterialProps) {
    return (
        // @container: Spaltenzahl richtet sich nach der Breite des Hauptbereichs
        <section className="@container space-y-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Snowflake className="h-5 w-5 text-muted-foreground" />
                Material ({material.length})
            </h2>

            {material.length === 0 ? (
                <p className="rounded-xl border p-4 text-muted-foreground">Kein Material vorhanden</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-3">
                    {material.map((a) => (
                        <MaterialKarte
                            key={a.ID}
                            verleihId={saisonverleihid}
                            material={a}
                            kundeId={kundeId}
                            bezahlt={bezahlt}
                            letztesMaterial={material.length === 1}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
