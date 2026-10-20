"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import SaisonMaterialListe from "./material/SaisonMaterialListe";
import UebersichtCecked from "./Uebersicht/UebersichtCecked";
import { useState } from "react";
import UebersichtBemerkung from "./Uebersicht/UebersichtBemerkung";
import UebersichtSpeichern from "./Uebersicht/UebersichtSpeichern";
import { format } from "date-fns";
import { anzahlTage } from "./VerleihArtAuswahl";

export default function UebersichtStep() {
  const { kunde, datenVollstaendig, art, zeitraum } = useSaisonverleihContext();
  const tage = anzahlTage(zeitraum?.from, zeitraum?.to);
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
                {kunde.Ort?.Postlz} {kunde.Ort?.Ort}
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Art:</h3>
              {art === "tag" ? (
                <p className="text-sm">
                  Tagesverleih{" "}
                  {zeitraum?.from && zeitraum?.to
                    ? `${format(zeitraum.from, "dd.MM.yyyy")} – ${format(zeitraum.to, "dd.MM.yyyy")} (${tage} ${tage === 1 ? "Tag" : "Tage"})`
                    : <span className="text-destructive">– bitte Zeitraum wählen</span>}
                </p>
              ) : (
                <p className="text-sm">Saisonverleih</p>
              )}
            </div>
            
            <div className="text-center py-4 sm:py-12">
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
