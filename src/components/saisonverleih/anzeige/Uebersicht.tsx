"use client";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Info, Receipt } from "lucide-react";

import DetailKopf, { DetailAktionsleiste, DetailKarte } from "@/components/detail/DetailKopf";
import KundeForm from "@/components/kunde/KundeForm";
import ButtonQuittungZuweisen from "@/components/quittung/ButtonQuittungZuweisen";
import QuittungKurzInfo from "@/components/quittung/QuittungKurzInfo";
import { saisonverleihDetailsOptions } from "@/hooks/useSaisonverleihDetailOptions";
import VerleihAktionen, { istVerleihBezahlt } from "../bearbeiten/VerleihAktionen";
import SaisonverleihCardBezahlt from "../liste/SaisonverleihCardBezahlt";
import SaisonverleihCardStatus from "../liste/SaisonverleihCardStatus";
import VerleihArtBadge from "../liste/VerleihArtBadge";
import EtikettenDruckButton from "./EtikettenDruckButton";
import { AlleBindungenPruefenButton } from "./MaterialBindungPruefen";
import SaisonVerleiAnzeigeMaterial from "./Material";
import SaisonVerleiAnzeigePDFButton from "./UebersichtPDFButton";
import VerleihStatusAktion from "./VerleihStatusAktion";

type SaisonVeliAnzeigeUebersichtProps = {
    saisonverleihID: number;
    // Material-ID aus dem QR-Code, diese Karte wird hervorgehoben
    hervorheben?: number;
}

export default function SaisonVerleiAnzeigeUebersicht({ saisonverleihID, hervorheben }: SaisonVeliAnzeigeUebersichtProps) {
    const { data: verleih, isPending, error } = useQuery(saisonverleihDetailsOptions(saisonverleihID));

    if (error) {
        return <div className="text-destructive">Fehler beim Laden: {error.message}</div>;
    }

    if (!verleih || isPending) {
        return <div>Saisonverleih wird geladen...</div>;
    }

    const material = verleih.Material ?? [];
    const kundenname = [verleih.Kunde.Vorname, verleih.Kunde.Nachname].filter(Boolean).join(" ");

    return (
        <div className="space-y-4">
            <DetailKopf
                zurueckHref="/saisonverleih/anzeigen"
                zurueckText="Verleihe"
                titel={verleih.Name}
                unterzeile={
                    <>
                        {kundenname}
                        {verleih.Abgeholt_Am && ` · abgeholt am ${format(parseISO(verleih.Abgeholt_Am), "dd.MM.yyyy")}`}
                    </>
                }
                badges={
                    <>
                        <VerleihArtBadge art={verleih.Art} startAm={verleih.Start_Am} endeAm={verleih.Ende_Am} />
                        <SaisonverleihCardStatus status={verleih.Status} />
                        <SaisonverleihCardBezahlt bezahlt={verleih.Bezahlt} />
                    </>
                }
                betrag={material.reduce((summe, m) => summe + m.Preis, 0)}
                hauptaktion={
                    <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                        <AlleBindungenPruefenButton verleih={verleih} />
                        <VerleihStatusAktion verleihId={verleih.ID} status={verleih.Status} />
                    </div>
                }
            />

            <DetailAktionsleiste>
                <VerleihAktionen verleih={verleih}>
                    <SaisonVerleiAnzeigePDFButton saisonverleihanzeigeID={verleih.ID} />
                    <EtikettenDruckButton verleihId={verleih.ID} deaktiviert={!material.some((m) => m.skinr || m.schuhnr)} />
                    <ButtonQuittungZuweisen quittungID={verleih.QuittungID} ziel={{ art: "verleih", id: verleih.ID }} />
                </VerleihAktionen>
            </DetailAktionsleiste>

            {/* Handy: Material, dann Kunde und Quittung. Tablet hochkant: Kunde | Quittung oben, darunter Material. Ab lg: Material links, Seitenbereich rechts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
                <div className="md:order-2 lg:order-1 lg:col-span-2">
                    <SaisonVerleiAnzeigeMaterial verleih={verleih} bezahlt={istVerleihBezahlt(verleih)} hervorheben={hervorheben} />
                </div>

                <aside className="grid grid-cols-1 items-start gap-4 md:order-1 md:grid-cols-2 lg:order-2 lg:grid-cols-1">
                    <KundeForm kunde={verleih.Kunde} />
                    <div className="space-y-4">
                        <DetailKarte titel="Quittung" icon={Receipt}>
                            <QuittungKurzInfo quittungID={verleih.QuittungID} />
                        </DetailKarte>
                        {verleih.Bemerkung && (
                            <DetailKarte titel="Bemerkung" icon={Info}>
                                <p className="whitespace-pre-line text-sm">{verleih.Bemerkung}</p>
                            </DetailKarte>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}
