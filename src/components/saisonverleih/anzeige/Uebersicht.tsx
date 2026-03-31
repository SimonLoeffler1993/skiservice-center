"use client";
import { useQuery } from "@tanstack/react-query";
import { Suspense, use } from "react";

import KundeForm from "@/components/kunde/KundeForm";
import SaisonVerleiAnzeigeMaterial from "./Material";
import SaisonVerleiAnzeigePDFButton from "./UebersichtPDFButton";
import SaisonverleihCardBezahlt from "../liste/SaisonverleihCardBezahlt";
import SaisonverleihCardStatus from "../liste/SaisonverleihCardStatus";
import UebersichtGesamtPreis from "./UebersichtGesamtPreis";
import SaisonVerleiAnzeigeUebersichtBemerkung from "./UebersichtBemerkung";
import QuittungKurzInfo from "@/components/quittung/QuittungKurzInfo";

import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";

// TODO Rechter Seiten Strifen bei Handy weg


type SaisonVeliAnzeigeUebersichtProps = {
    saisonverleihID: number;
}

export default function SaisonVerleiAnzeigeUebersicht({ saisonverleihID }: SaisonVeliAnzeigeUebersichtProps) {
    // const { data: saisonVerleihDetails } = useSaisonverleihDetails({ saisonverleihID });

    const {data: saisonVerleihDetails, isPending, error} = useQuery(saisonverleihDetailsOptions(saisonverleihID));

    // const { saisonverleihanzeigePromise } = useSaisonverleihanzeigeContext();
    // const saisonverleihanzeige = use(saisonverleihanzeigePromise);
    if (!saisonVerleihDetails || isPending) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Fehler beim Laden: {error.message}</div>;
    }

    // console.log(saisonverleihanzeige);
    return (

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Linke Spalte: Name, Preis, Status, Kunde */}
            <div className="flex flex-col gap-4 md:col-span-4">
                {/* Header: Name links, Preis rechts */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p className="text-2xl font-bold text-gray-900">{saisonVerleihDetails.Name}</p>
          
                        <div className="w-full md:w-auto md:self-start">
                            <UebersichtGesamtPreis Material={saisonVerleihDetails?.Material ?? []} />
                        </div>
                </div>

                {/* Statuszeile */}
                <div className="flex flex-wrap items-center gap-3">
                    <SaisonverleihCardStatus status={saisonVerleihDetails.Zurueck} />
                    <SaisonverleihCardBezahlt bezahlt={saisonVerleihDetails.Bezahlt} />
                    <SaisonVerleiAnzeigePDFButton saisonverleihanzeigeID={saisonVerleihDetails.ID} />
                </div>

                {/* Bemerkung */}
                {saisonVerleihDetails.Bemerkung && (
                <div className="bg-white p-4">
                    <SaisonVerleiAnzeigeUebersichtBemerkung bemerkung={saisonVerleihDetails.Bemerkung} />
                </div>
                )}

  
                < QuittungKurzInfo quittungID={saisonVerleihDetails.QuittungID} />
      

                {/* Kunde */}
                <div className="bg-white p-4">
                    <KundeForm kunde={saisonVerleihDetails.Kunde} />
                </div>
            </div>

            {/* Rechte Spalte: Material */}
            <div className="bg-white p-4 border-s md:h-full md:col-span-8">
                <SaisonVerleiAnzeigeMaterial material={saisonVerleihDetails?.Material ?? []} saisonverleihid={saisonVerleihDetails?.ID} />
            </div>
        </div>

    );
}

