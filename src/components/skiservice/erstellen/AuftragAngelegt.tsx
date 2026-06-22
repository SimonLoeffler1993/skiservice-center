"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


type AuftragAnlegenProps = {
    serviceAuftragID: number
}

export default function AuftragAngelegt({ serviceAuftragID }: AuftragAnlegenProps) {
    const router = useRouter()

    function handleNeuEingabe() {
        // Seite komplett neu Laden
        window.location.reload()
    }

    function handleAnzeigen() {
        router.push(`skiservice/anzeigen/${serviceAuftragID}`)
    }

    return (
        <div className="flex gap-4">
            <Button onClick={handleNeuEingabe}>neu erfassen</Button>
            <Button onClick={handleAnzeigen}>Anzeigen</Button>
        </div>
    )
}