"use client";

import { useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Mountain, ClipboardList } from "lucide-react";
import KundeSelectionStep from "@/components/saisonverleih/KundeSelectionStep";
import SkiSelectionStep from "@/components/saisonverleih/SkiSelectionStep";
import UebersichtStep from "@/components/saisonverleih/UebersichtStep";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import SchrittNavigation, { SchrittNavigationProps } from "@/components/schritte/SchrittNavigation";

export default function SaisonverleihErstellen() {
  const [activeTab, setActiveTab] = useState("kunde");

  const { kunde, art, materialList } = useSaisonverleihContext();
  const titel = art === "tag" ? "Tagesverleih" : "Saisonverleih";
  const tabsRef = useRef<HTMLDivElement>(null);

  // Schritt wechseln und zu den Tabs hochscrollen
  function gehe(tab: string) {
    setActiveTab(tab);
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Navigation je Schritt, oben unter den Tabs und unten am Ende gleich
  const keinKunde = "Bitte zuerst einen Kunden auswählen.";
  const navKunde: SchrittNavigationProps = {
    weiter: { titel: "Ski auswählen", onClick: () => gehe("ski"), gesperrt: !kunde, hinweis: kunde ? undefined : keinKunde },
  };
  const navSki: SchrittNavigationProps = {
    zurueck: { titel: "Kunde", onClick: () => gehe("kunde") },
    weiter: {
      titel: "Gesamtübersicht",
      onClick: () => gehe("uebersicht"),
      gesperrt: !kunde,
      hinweis: !kunde ? keinKunde : materialList.length === 0 ? "Noch kein Material erfasst." : undefined,
    },
  };
  const navUebersicht: SchrittNavigationProps = { zurueck: { titel: "Ski auswählen", onClick: () => gehe("ski") } };

  return (
    <div className="rounded-lg bg-gray-50 p-2 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{titel} Erstellen</h1>
          <p className="text-base sm:text-lg text-gray-600">Hier können Sie einen neuen {titel} erfassen.</p>
        </div>

        {/* forceMount: Schritte werden nur ausgeblendet, damit Eingaben beim Zurückspringen erhalten bleiben */}
        <Tabs ref={tabsRef} value={activeTab} onValueChange={setActiveTab} className="w-full scroll-mt-4">
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

          <TabsContent value="kunde" forceMount className="mt-6 data-[state=inactive]:hidden">
            <SchrittNavigation {...navKunde} position="oben" />
            <KundeSelectionStep />
            <SchrittNavigation {...navKunde} />
          </TabsContent>

          <TabsContent value="ski" forceMount className="mt-6 data-[state=inactive]:hidden">
            <SchrittNavigation {...navSki} position="oben" />
            <SkiSelectionStep />
            <SchrittNavigation {...navSki} />
          </TabsContent>

          <TabsContent value="uebersicht" forceMount className="mt-6 data-[state=inactive]:hidden">
            <SchrittNavigation {...navUebersicht} position="oben" />
            <UebersichtStep />
            <SchrittNavigation {...navUebersicht} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}