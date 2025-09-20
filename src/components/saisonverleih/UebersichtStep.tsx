"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import SaisonMaterialListe from "./material/SaisonMaterialListe";
import UebersichtCecked from "./Uebersicht/UebersichtCecked";
import { useState } from "react";
import UebersichtBemerkung from "./Uebersicht/UebersichtBemerkung";
import UebersichtSpeichern from "./Uebersicht/UebersichtSpeichern";

export default function UebersichtStep() {
  const { kunde, datenVollstaendig } = useSaisonverleihContext();
  const [checked, setChecked] = useState(false);


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
              <SaisonMaterialListe showAktionSpalte={false} />
            </div>
            <div>
              <UebersichtBemerkung />
            </div>
            <div className="py-4">
            <UebersichtCecked checked={checked} setChecked={setChecked} fertig={datenVollstaendig} />

            {!datenVollstaendig ?(
              <p className="text-muted-foreground">
                Daten sind nicht Vollständig ausgefüllt!
              </p>
            ): null}
              
            <UebersichtSpeichern datenChecked={checked} />
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
