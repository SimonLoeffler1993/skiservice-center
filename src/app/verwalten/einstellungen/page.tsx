import { Settings } from "lucide-react";

import EinstellungenFormular from "@/components/einstellungen/EinstellungenFormular";

export default function EinstellungenPage() {
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Einstellungen</h1>
            </div>
            <EinstellungenFormular />
        </section>
    );
}
