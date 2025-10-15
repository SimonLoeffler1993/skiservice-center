"use client"
import SkiHerstellerForm from "@/components/material/skierstellen/herstellerform";
import SkiForm from "@/components/material/skierstellen/skiform";
import { useSearchParams } from "next/navigation";

export default function MaterialPage() {
    const searchParams = useSearchParams()
    const view = searchParams.get("view") ?? "ski"
    
    switch (view) {
        case "skihersteller":
            return <SkiHerstellerForm />
        case "skimodell":
            return <p>Skimodell</p>
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