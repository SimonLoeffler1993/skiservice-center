import { KeyRound } from "lucide-react";

import GeraeteVerwaltung from "@/components/geraete/GeraeteVerwaltung";
import { rechtSeite } from "@/lib/seitenschutz";

export default async function GeraeteSeite() {
    await rechtSeite("geraete.verwalten");
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Geräte</h1>
            </div>
            <GeraeteVerwaltung />
        </section>
    );
}
