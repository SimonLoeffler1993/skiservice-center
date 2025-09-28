"use client"

import { useSaisonverleihlisteContext } from "@/context/saisonverleihliste-context";
import { use } from "react";
import SaisonverleihListeCard from "./SaisonverleihListeCard";

export default function SaisonverleihListe() {
    const { saisonverleihlistePromise } = useSaisonverleihlisteContext();
    const saisonverleihliste = use(saisonverleihlistePromise);

    if (!saisonverleihliste) {
        return <p>Saisonverleihliste nicht gefunden</p>;
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {saisonverleihliste.map((saisonverleih) => (
                <SaisonverleihListeCard key={saisonverleih.ID} saisonverleih={saisonverleih} />
            ))}
        </div>
    );
}