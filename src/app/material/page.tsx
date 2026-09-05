"use client"
import SkiHerstellerForm from "@/components/material/skierstellen/herstellerform";
import SkiForm from "@/components/material/skierstellen/skiform";
import { useSearchParams } from "next/navigation";
import SkiModellForm from "@/components/material/skierstellen/modellform";
import SchuhHerstellerForm from "@/components/material/skischuhe/herstellerform";
import SchuhModellForm from "@/components/material/skischuhe/modellform";
import SkischuhForm from "@/components/material/skischuhe/schuhform";
import SkiStoeckeForm from "@/components/material/skistoecke/stoeckeform";

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
            return <SchuhHerstellerForm />
        case "schuhmodell":
            return <SchuhModellForm />
        case "schuherstellen":
            return <SkischuhForm />
        case "stoecke":
            return <SkiStoeckeForm />
        default:
            return <p>Material</p>
    }
}