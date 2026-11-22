import { UserRoundCog } from "lucide-react";

import MeinKonto from "@/components/anmeldung/MeinKonto";
import { holeStatus } from "@/lib/anmeldungactions";
import { fehlerText } from "@/types/anmeldung";

export default async function KontoSeite({ searchParams }: {
    searchParams: Promise<{ pflicht?: string; verknuepft?: string; geraet_angemeldet?: string; fehler?: string }>;
}) {
    const { pflicht, verknuepft, geraet_angemeldet: geraetAngemeldet, fehler } = await searchParams;
    const status = await holeStatus();
    // Rückkehr vom Anbieter (Konto verknüpfen bzw. Gerät anmelden)
    const hinweis = verknuepft
        ? { art: "ok" as const, text: "Konto verknüpft. Du kannst dich jetzt auch über den Anbieter anmelden." }
        : geraetAngemeldet
        ? { art: "ok" as const, text: "Dieses Gerät ist jetzt dauerhaft angemeldet. Nach dem Abmelden erscheint die Bedienerauswahl." }
        : fehler ? { art: "fehler" as const, text: fehlerText(fehler) } : null;

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <UserRoundCog className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Mein Konto</h1>
            </div>
            <MeinKonto status={status.success ? status.data : null} pflicht={pflicht === "1"} hinweis={hinweis} />
        </section>
    );
}
