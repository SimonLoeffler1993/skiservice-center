"use client"
import KundeForm from "@/components/kunde/KundeForm";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkiListe from "../SkiListe";
import { Mountain } from "lucide-react";
import { AuftragBezahlt } from "./AuftragBezahlt";
import { AuftragBenachrichtigt } from "./AuftragBenachrichtigt";
import { AuftragStatus } from "./AuftragStatus";
import AuftragFertigBis from "./AuftragFertigBis";
import SkiEttikettenDruckButton from "../SkiEttikettenDruckButton";
import AuftragAktionen from "../bearbeiten/AuftragAktionen";
import ButtonQuittungZuweisen from "@/components/quittung/ButtonQuittungZuweisen";
import QuittungKurzInfo from "@/components/quittung/QuittungKurzInfo";

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

    return (
        <div className="grid grid-cols-1 sm:grid-cols-10 gap-2">
            <div className="sm:col-span-4">
                <KundeForm kunde={skiserviceData.data?.kunde}></KundeForm>
            </div>
            <div className="sm:col-span-6">
                <Card className="mt-6">
                    <CardHeader className="flex flex-row items-center">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            <Mountain className="h-4 w-4" />
                            Service
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-3 flex flex-col gap-2">
                            <SkiEttikettenDruckButton skis={skiserviceData.data.skis} />
                            <AuftragAktionen auftrag={skiserviceData.data} />
                        </div>
                        <div className="mb-3">
                            <AuftragFertigBis fertigBis={skiserviceData.data.abhol_date} />
                        </div>
                        <AuftragBezahlt bezahlt={skiserviceData.data.bezahlt} />
                        <AuftragBenachrichtigt benachrichtigt={skiserviceData.data.benachrichtigt} className="ml-2" />
                        <AuftragStatus status={skiserviceData.data.wie} className="ml-2" />
                        {/* Quittung wie beim Saisonverleih: anzeigen bzw. externen Beleg zuweisen */}
                        <div className="my-3 space-y-2">
                            <ButtonQuittungZuweisen
                                quittungID={skiserviceData.data.quittung_id}
                                ziel={{ art: "auftrag", id: skiserviceData.data.id }}
                            />
                            <QuittungKurzInfo quittungID={skiserviceData.data.quittung_id} />
                        </div>
                        <SkiListe
                            skis={skiserviceData.data.skis}
                            bearbeiten={{
                                bezahlt: skiserviceData.data.bezahlt === "ja" || skiserviceData.data.quittung_id != null,
                                kundeId: skiserviceData.data.kunden_id,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}