"use client"
import { useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";

import DetailKopf, { DetailAktionsleiste, DetailKarte } from "@/components/detail/DetailKopf";
import KundeForm from "@/components/kunde/KundeForm";
import ButtonQuittungZuweisen from "@/components/quittung/ButtonQuittungZuweisen";
import QuittungKurzInfo from "@/components/quittung/QuittungKurzInfo";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import AuftragAktionen, { AlleFertigButton } from "../bearbeiten/AuftragAktionen";
import SkiEttikettenDruckButton from "../SkiEttikettenDruckButton";
import SkiListe from "../SkiListe";
import { AuftragBenachrichtigt } from "./AuftragBenachrichtigt";
import { AuftragBezahlt } from "./AuftragBezahlt";
import AuftragFertigBis from "./AuftragFertigBis";
import { AuftragStatus } from "./AuftragStatus";

type SkiserviceAuftragDetailsProps = {
    skiserviceAuftragID: number;
}

export default function SkiserviceAnzeigenAuftragDetails({ skiserviceAuftragID }: SkiserviceAuftragDetailsProps) {
    const { data: skiserviceData, isPending, error } = useQuery(auftragDetailsOptions(skiserviceAuftragID))

    if (error) {
        return <div className="text-destructive">Fehler beim Laden: {error.message}</div>
    }

    if (!skiserviceData || isPending) {
        return <div>Skiservice Daten werden geladen...</div>
    }

    if (!skiserviceData.data?.kunde) {
        return <div>Daten nicht Vollständig</div>
    }

    const auftrag = skiserviceData.data;
    const kundenname = [auftrag.kunde.Vorname, auftrag.kunde.Nachname].filter(Boolean).join(" ");
    const bezahlt = auftrag.bezahlt === "ja" || auftrag.quittung_id != null;
    const gesamt = auftrag.skis.reduce((summe, ski) => summe + ski.preis + (ski.bindung_check ? ski.bindung_preis : 0), 0);

    return (
        <div className="space-y-4">
            <DetailKopf
                zurueckHref="/skiservice/anzeigen"
                zurueckText="Aufträge"
                titel={auftrag.name ?? `Auftrag #${auftrag.id}`}
                unterzeile={<>{kundenname} · <AuftragFertigBis fertigBis={auftrag.abhol_date} /></>}
                badges={
                    <>
                        <AuftragStatus status={auftrag.wie} />
                        <AuftragBezahlt bezahlt={auftrag.bezahlt} />
                        <AuftragBenachrichtigt benachrichtigt={auftrag.benachrichtigt} />
                    </>
                }
                betrag={gesamt}
                hauptaktion={<AlleFertigButton auftrag={auftrag} />}
            />

            <DetailAktionsleiste>
                <AuftragAktionen auftrag={auftrag}>
                    <SkiEttikettenDruckButton skis={auftrag.skis} />
                    {/* Quittung wie beim Saisonverleih: externen Beleg zuweisen */}
                    <ButtonQuittungZuweisen quittungID={auftrag.quittung_id} ziel={{ art: "auftrag", id: auftrag.id }} />
                </AuftragAktionen>
            </DetailAktionsleiste>

            {/* Gleiche Anordnung wie beim Verleih: Handy Ski zuerst, Tablet hochkant Kunde | Quittung oben, ab lg Ski links */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-start">
                <div className="md:order-2 lg:order-1 lg:col-span-2">
                    <SkiListe auftrag={auftrag} bezahlt={bezahlt} />
                </div>

                <aside className="grid grid-cols-1 items-start gap-4 md:order-1 md:grid-cols-2 lg:order-2 lg:grid-cols-1">
                    <KundeForm kunde={auftrag.kunde} />
                    <DetailKarte titel="Quittung" icon={Receipt}>
                        <QuittungKurzInfo quittungID={auftrag.quittung_id} />
                    </DetailKarte>
                </aside>
            </div>
        </div>
    )
}
