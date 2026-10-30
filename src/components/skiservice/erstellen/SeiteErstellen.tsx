"use client";

import { User, Mountain } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRef, useState } from "react";
import KundeTab from "@/components/kunde/KundeTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceErstellenTab from "./ServiceErstellenTab";
import { useKundeStore } from "@/stores/useKundeStore";
import SchrittNavigation, { SchrittNavigationProps } from "@/components/schritte/SchrittNavigation";

export default function SkiserviceErstellen() {
    const [activeTab, setActiveTab] = useState("kunde");
    const { kunde } = useKundeStore();
    const tabsRef = useRef<HTMLDivElement>(null);

    // Schritt wechseln und zu den Tabs hochscrollen
    function gehe(tab: string) {
        setActiveTab(tab);
        tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Navigation je Schritt, oben unter den Tabs und unten am Ende gleich
    const navKunde: SchrittNavigationProps = {
        weiter: {
            titel: "Skiservice auswählen",
            onClick: () => gehe("ski"),
            gesperrt: !kunde,
            hinweis: kunde ? undefined : "Bitte zuerst einen Kunden auswählen.",
        },
    };
    const navSki: SchrittNavigationProps = { zurueck: { titel: "Kunde", onClick: () => gehe("kunde") } };

    return (
        <div className="rounded-lg bg-gray-50 p-2 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Skiservice Erstellen</h1>
                    <p className="text-base sm:text-lg text-gray-600">Hier kannst du einen neuen Skiservice erfassen.</p>
                </div>

                {/* forceMount: Schritte werden nur ausgeblendet, damit Eingaben beim Zurückspringen erhalten bleiben */}
                <Tabs ref={tabsRef} value={activeTab} onValueChange={setActiveTab} className="w-full scroll-mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="kunde" className="flex items-center gap-2 whitespace-normal text-xs sm:text-sm">
                            <User className="hidden h-4 w-4 sm:block" />
                            1. Kunde
                        </TabsTrigger>
                        <TabsTrigger value="ski" className="flex items-center gap-2 whitespace-normal text-xs sm:text-sm" disabled={!kunde}>
                            <Mountain className="hidden h-4 w-4 sm:block" />
                            2. Skiservice auswählen
                        </TabsTrigger>
                        {/* <TabsTrigger value="uebersicht" className="flex items-center gap-2 whitespace-normal text-xs sm:text-sm">
                            <ClipboardList className="hidden h-4 w-4 sm:block" />
                            3. Gesamt übersicht
                        </TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="kunde" forceMount className="mt-6 data-[state=inactive]:hidden">
                        <SchrittNavigation {...navKunde} position="oben" />
                        <Card>
                            <CardHeader>
                                <CardTitle>Kunde</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <KundeTab />
                                <SchrittNavigation {...navKunde} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="ski" forceMount className="mt-6 data-[state=inactive]:hidden">
                        <SchrittNavigation {...navSki} position="oben" />
                        <Card>
                            <CardHeader>
                                <CardTitle>Skiservice hinzufügen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ServiceErstellenTab />
                                <SchrittNavigation {...navSki} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="uebersicht" forceMount className="mt-6 data-[state=inactive]:hidden">
                        <p className="text-gray-500">Hier kommt die Gesamtübersicht hin.</p>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}