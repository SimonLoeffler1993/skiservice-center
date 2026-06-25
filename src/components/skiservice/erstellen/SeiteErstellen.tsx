"use client";

import { User, Mountain, ClipboardList } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import KundeTab from "@/components/kunde/KundeTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceErstellenTab from "./ServiceErstellenTab";

export default function SkiserviceErstellen() {
    const [activeTab, setActiveTab] = useState("kunde");

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Skiservice Erstellen</h1>
                    <p className="text-lg text-gray-600">Hier kannst du einen neuen Skiservice erfassen.</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="kunde" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            1. Kunde
                        </TabsTrigger>
                        <TabsTrigger value="ski" className="flex items-center gap-2" >
                            <Mountain className="h-4 w-4" />
                            2. Ski auswählen
                        </TabsTrigger>
                        {/* <TabsTrigger value="uebersicht" className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4" />
                            3. Gesamt übersicht
                        </TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="kunde" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kunde</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <KundeTab />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="ski" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Skiservice hinzufügen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ServiceErstellenTab />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="uebersicht" className="mt-6">
                        <p className="text-gray-500">Hier kommt die Gesamtübersicht hin.</p>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}