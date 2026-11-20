import { Users } from "lucide-react";

import BenutzerVerwaltung from "@/components/benutzer/BenutzerVerwaltung";
import { nurAdminSeite } from "@/lib/seitenschutz";

export default async function BenutzerSeite() {
    await nurAdminSeite();
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Benutzer</h1>
            </div>
            <BenutzerVerwaltung />
        </section>
    );
}
