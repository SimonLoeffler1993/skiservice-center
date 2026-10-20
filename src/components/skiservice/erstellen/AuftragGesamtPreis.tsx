import { type FormInhalte } from "./ServiceErstellenTab";
import { useWatch } from "react-hook-form";

export default function AuftragGesamtPreis(){
    const skis = useWatch<FormInhalte, "skiservices">({ name: "skiservices" }) ?? [];
    
    const gesamtPreis = skis.reduce((gesamt, ski) => {
        const bindungPreis = ski.bindung_check ? ski.bindung_preis : 0;
        // Leeres Preisfeld ergibt NaN und würde die Summe zerstören
        const preis = Number.isFinite(ski.preis) ? ski.preis : 0;
        return gesamt + bindungPreis + preis
    },0);

    return(
        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2 border">
            <span className="text-sm text-muted-foreground">Gesamtpreis</span>
            <span className="text-lg font-semibold tabular-nums">
                {gesamtPreis.toFixed(2)} €
            </span>
        </div>
    )
}