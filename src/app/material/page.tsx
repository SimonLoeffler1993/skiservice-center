"use client"
import SkiHerstellerForm from "@/components/material/skierstellen/herstellerform";
import SkiForm from "@/components/material/skierstellen/skiform";
import { useSearchParams } from "next/navigation";
import SkiModellForm from "@/components/material/skierstellen/modellform";

export default function MaterialPage() {
    const searchParams = useSearchParams()
    const view = searchParams.get("view") ?? "ski"
    
    switch (view) {
        case "skihersteller":
            return <SkiHerstellerForm />
        case "skimodell":
            return <SkiModellForm />
        case "skierstellen":
            return <SkiForm />
        case "schuhhersteller":
            return <p>Schuhhersteller</p>
        case "schuhmodell":
            return <p>Schuhmodell</p>
        case "schuhstellen":
            return <p>Schuhstellen</p>
        default:
            return <p>Material</p>
    }
}