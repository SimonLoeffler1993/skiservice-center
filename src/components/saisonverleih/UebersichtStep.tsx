"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";

export default function UebersichtStep() {
  const { kunde } = useSaisonverleihContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Gesamt übersicht
        </CardTitle>
      </CardHeader>
      <CardContent>
        {kunde ? (
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Ausgewählter Kunde:</h3>
              <p className="text-sm">
                {kunde.Vorname} {kunde.Nachname}<br />
                {kunde.Strasse}<br />
                {kunde.Ort.Postlz} {kunde.Ort.Ort}
              </p>
            </div>
            
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Gesamt übersicht wird hier angezeigt...
              </p>
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
