"use client"

import SaisonverleihAnzeigeUebersicht from "@/components/saisonverleih/anzeige/Uebersicht";
import { Suspense } from "react";

export default function SaisonverleihAnzeigen() {

    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1>Saisonverleih Anzeigen</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <SaisonverleihAnzeigeUebersicht />
            </Suspense>
        </div>
    );
}   