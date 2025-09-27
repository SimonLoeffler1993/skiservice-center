"use client";

import { use } from "react";
import { useSaisonverleihanzeigeContext } from "@/context/saisonverleihanzeige-contex";
import KundeForm from "@/components/kunde/KundeForm";
import SaisonVerleiAnzeigeMaterial from "./Material";


export default function SaisonVerleiAnzeigeUebersicht() {
    const { saisonverleihanzeigePromise } = useSaisonverleihanzeigeContext();
    const saisonverleihanzeige = use(saisonverleihanzeigePromise);

    console.log(saisonverleihanzeige);
    
    if (!saisonverleihanzeige || !saisonverleihanzeige.Kunde || !saisonverleihanzeige.Material) {
        return <div>Loading...</div>;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h1 className="col-span-1 md:col-span-2">Uebersicht</h1>
            <p className="col-span-1 md:col-span-2">{saisonverleihanzeige.Name}</p>
            <div className="col-span-1 md:col-span-1">
                <KundeForm kunde={saisonverleihanzeige.Kunde} />
            </div>
            <div className="col-span-1 md:col-span-1">
                <SaisonVerleiAnzeigeMaterial material={saisonverleihanzeige.Material} />
            </div>
        </div>
    );
}