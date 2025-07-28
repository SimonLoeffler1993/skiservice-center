"use client";
    
import { useState } from "react";
import { useSkikundenContext } from "@/context/skikunden-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import KundeSuchForm from "@/components/kunde/suche/suchform";
import KundeForm from "@/components/kunde/KundeForm";
import { Kunde } from "@/types/skikundentypes";
import { User, Edit, X } from "lucide-react";
import KundeTerminalButton from "@/components/kunde/KundeTerminalButton";

interface KundeSelectionStepProps {
  onNextStep?: () => void;
}

export default function KundeSelectionStep({ 
  onNextStep 
}: KundeSelectionStepProps) {
  const { kunde, setKunde } = useSkikundenContext();
  const [showKundeSearch, setShowKundeSearch] = useState(!kunde);

  const handleKundeSelected = (selectedKunde: Kunde) => {
    setKunde(selectedKunde);
    setShowKundeSearch(false);
    onNextStep?.();
  };

  const handleKundeChange = () => {
    setShowKundeSearch(true);
  };

  const handleCancelChange = () => {
    setShowKundeSearch(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {kunde && !showKundeSearch ? "Ausgewählter Kunde" : "Kunde auswählen"}
          </div>
          {kunde && !showKundeSearch ? (
            <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleKundeChange}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Kunden ändern
            </Button>
            <KundeTerminalButton />
            </>
          ) : kunde && showKundeSearch ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancelChange}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Abbrechen
            </Button>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {kunde && !showKundeSearch ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">Kunde ausgewählt</span>
              </div>
            </div>
            <KundeForm kunde={kunde} onClose={handleKundeChange} />
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-4">
              Suchen Sie einen Kunden aus oder erstellen Sie einen neuen Kunden für den Saisonverleih.
            </p>
            <KundeSuchForm 
              onKundeSelected={handleKundeSelected}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
