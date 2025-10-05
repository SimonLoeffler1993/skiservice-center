import SaisonverleihListe from "@/components/saisonverleih/liste/SaisonverleihListe";
import { Snowflake } from "lucide-react";
import { Suspense } from "react";

export default function SaisonVerleiAnzeige() {
    // TODO Menuleiste
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">   
                <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-muted-foreground" />
                    <h1 className="text-xl font-semibold">Saisonverleih</h1>
                </div>
            </div>
            <Suspense fallback={<p>Saisonverleihliste wird zusammen gekruschelt...</p>}>
                <SaisonverleihListe />
            </Suspense>
        </section>
    )
}