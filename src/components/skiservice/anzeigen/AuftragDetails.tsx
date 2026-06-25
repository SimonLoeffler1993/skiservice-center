"use client"
import KundeForm from "@/components/kunde/KundeForm";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkiListe from "../SkiListe";
import { Mountain } from "lucide-react";

type SkiserviceAuftragDetailsProps = {
    skiserviceAuftragID: number;
}

export default function SkiserviceAnzeigenAuftragDetails({ skiserviceAuftragID }: SkiserviceAuftragDetailsProps) {
    const { data: skiserviceData, isPending, error } = useQuery(auftragDetailsOptions(skiserviceAuftragID))

    if (!skiserviceData || isPending) {
        return <div>Skiservice Daten werden geladen...</div>
    }

    if (error) {
        return <div>FEHLER beim Laden: {error.message}</div>
    }

    if (!skiserviceData.data?.kunde) {
        return <div>Daten nicht Vollständig</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-10 gap-2">
            <div className="col-span-4">
                <KundeForm kunde={skiserviceData.data?.kunde}></KundeForm>
            </div>
            <div className="col-span-6">
                <Card className="mt-6">
                    <CardHeader className="flex flex-row items-center">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                            <Mountain className="h-4 w-4" />
                            Service
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SkiListe skis={skiserviceData.data.skis} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}