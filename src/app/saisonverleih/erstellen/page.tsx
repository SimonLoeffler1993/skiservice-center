"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Mountain, ClipboardList } from "lucide-react";
import KundeSelectionStep from "@/components/saisonverleih/KundeSelectionStep";
import SkiSelectionStep from "@/components/saisonverleih/SkiSelectionStep";
import UebersichtStep from "@/components/saisonverleih/UebersichtStep";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";

export default function SaisonverleihErstellen() {
  const [activeTab, setActiveTab] = useState("kunde");

  const { kunde } = useSaisonverleihContext();

  

  return (
    <div className="rounded-lg bg-gray-50 p-2 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Saisonverleih Erstellen</h1>
          <p className="text-base sm:text-lg text-gray-600">Hier können Sie einen neuen Saisonverleih erfassen.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kunde" className="flex items-center gap-2 whitespace-normal text-xs sm:text-sm">
              <User className="hidden h-4 w-4 sm:block" />
              1. Kunde
            </TabsTrigger>
            <TabsTrigger value="ski" className="flex items-center gap-2 whitespace-normal text-xs sm:text-sm" disabled={!kunde}>
              <Mountain className="hidden h-4 w-4 sm:block" />
              2. Ski auswählen
            </TabsTrigger>
            <TabsTrigger value="uebersicht" className="flex items-center gap-2 whitespace-normal text-xs sm:text-sm" disabled={!kunde}>
              <ClipboardList className="hidden h-4 w-4 sm:block" />
              3. Gesamt übersicht
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kunde" className="mt-6">
            <KundeSelectionStep />
          </TabsContent>

          <TabsContent value="ski" className="mt-6">
              <SkiSelectionStep />
          </TabsContent>

          <TabsContent value="uebersicht" className="mt-6">
            <UebersichtStep />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}