"use client";

import { use } from "react";
import { useSaisonverleihanzeigeContext } from "@/context/saisonverleihanzeige-contex";
import KundeForm from "@/components/kunde/KundeForm";
import SaisonVerleiAnzeigeMaterial from "./Material";
import SaisonVerleiAnzeigePDFButton from "./UebersichtPDFButton";
import SaisonverleihCardBezahlt from "../liste/SaisonverleihCardBezahlt";
import SaisonverleihCardStatus from "../liste/SaisonverleihCardStatus";
import UebersichtGesamtPreis from "./UebersichtGesamtPreis";
import SaisonVerleiAnzeigeUebersichtBemerkung from "./UebersichtBemerkung";

// TODO Rechter Seiten Strifen bei Handy weg

export default function SaisonVerleiAnzeigeUebersicht() {
    const { saisonverleihanzeigePromise } = useSaisonverleihanzeigeContext();
    const saisonverleihanzeige = use(saisonverleihanzeigePromise);

    console.log(saisonverleihanzeige);

    if (!saisonverleihanzeige || !saisonverleihanzeige.Kunde || !saisonverleihanzeige.Material) {
        return <div>Loading...</div>;
    }
    return (

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Linke Spalte: Name, Preis, Status, Kunde */}
            <div className="flex flex-col gap-4 md:col-span-4">
                {/* Header: Name links, Preis rechts */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p className="text-2xl font-bold text-gray-900">{saisonverleihanzeige.Name}</p>
          
                        <div className="w-full md:w-auto md:self-start">
                            <UebersichtGesamtPreis Material={saisonverleihanzeige.Material} />
                        </div>
                </div>

                {/* Statuszeile */}
                <div className="flex flex-wrap items-center gap-3">
                    <SaisonverleihCardStatus status={saisonverleihanzeige.Zurueck} />
                    <SaisonverleihCardBezahlt bezahlt={saisonverleihanzeige.Bezahlt} />
                    <SaisonVerleiAnzeigePDFButton saisonverleihanzeigeID={saisonverleihanzeige.ID} />
                </div>

                {/* Bemerkung */}
                {saisonverleihanzeige.Bemerkung && (
                <div className="bg-white p-4">
                    <SaisonVerleiAnzeigeUebersichtBemerkung bemerkung={saisonverleihanzeige.Bemerkung} />
                </div>
                )}

                {/* Kunde */}
                <div className="bg-white p-4">
                    <KundeForm kunde={saisonverleihanzeige.Kunde} />
                </div>
            </div>

            {/* Rechte Spalte: Material */}
            <div className="bg-white p-4 border-s md:h-full md:col-span-8">
                <SaisonVerleiAnzeigeMaterial material={saisonverleihanzeige.Material} saisonverleihid={saisonverleihanzeige.ID} />
            </div>
        </div>
    );
}