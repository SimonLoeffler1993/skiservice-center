import { Users } from "lucide-react";

import BenutzerVerwaltung from "@/components/benutzer/BenutzerVerwaltung";
import GruppenVerwaltung from "@/components/benutzer/GruppenVerwaltung";
import RollenVerwaltung from "@/components/benutzer/RollenVerwaltung";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rechtSeite } from "@/lib/seitenschutz";

// ?reiter=gruppen|rollen öffnet einen Reiter
export default async function BenutzerSeite({ searchParams }: { searchParams: Promise<{ reiter?: string }> }) {
    await rechtSeite("benutzer.verwalten");
    const { reiter } = await searchParams;
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-xl font-semibold">Benutzer</h1>
            </div>
            <Tabs defaultValue={reiter === "gruppen" || reiter === "rollen" ? reiter : "benutzer"}>
                <TabsList>
                    <TabsTrigger value="benutzer">Benutzer</TabsTrigger>
                    <TabsTrigger value="gruppen">Gruppen</TabsTrigger>
                    <TabsTrigger value="rollen">Rollen</TabsTrigger>
                </TabsList>
                <TabsContent value="benutzer"><BenutzerVerwaltung /></TabsContent>
                <TabsContent value="gruppen"><GruppenVerwaltung /></TabsContent>
                <TabsContent value="rollen"><RollenVerwaltung /></TabsContent>
            </Tabs>
        </section>
    );
}
