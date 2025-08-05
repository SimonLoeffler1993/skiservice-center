"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import { Mountain } from "lucide-react";
import MaterialEingabe from "./material/MaterialEingabe";

export default function SkiSelectionStep() {
  const { kunde } = useSaisonverleihContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mountain className="h-5 w-5" />
          Ski auswählen
        </CardTitle>
      </CardHeader>
      <CardContent>
        {kunde ? (
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Ausgewählter Kunde:</h3>
              <p className="text-sm">
                {kunde.Vorname} {kunde.Nachname}
              </p>
            </div>
            <div className="text-center py-12">
              <MaterialEingabe />
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Bitte wählen Sie zuerst einen Kunden aus. 
          </p>
        )}
      </CardContent>
    </Card>
  );
}
