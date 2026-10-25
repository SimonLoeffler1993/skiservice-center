"use client";

import { Snowflake } from "lucide-react";

import { SaisonverleihRead } from "@/types/saisonverleihtypes";
import MaterialKarte from "./MaterialKarte";

type MaterialProps = {
    verleih: SaisonverleihRead;
    bezahlt: boolean;
};

export default function SaisonVerleiAnzeigeMaterial({ verleih, bezahlt }: MaterialProps) {
    const material = verleih.Material ?? [];
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
                            verleih={verleih}
                            material={a}
                            bezahlt={bezahlt}
                            letztesMaterial={material.length === 1}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
