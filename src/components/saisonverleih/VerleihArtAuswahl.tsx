"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";
import { de } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import { VerleihArt } from "@/types/saisonverleihtypes";
import { cn } from "@/lib/utils";

// Anzahl Verleihtage, Start- und Endtag zählen mit
export function anzahlTage(von?: Date, bis?: Date): number | null {
    if (!von || !bis) return null;
    return differenceInCalendarDays(bis, von) + 1;
}

export default function VerleihArtAuswahl() {
    const { art, setArt, zeitraum, setZeitraum, materialList } = useSaisonverleihContext();
    const [kalenderOffen, setKalenderOffen] = useState(false);
    const tage = anzahlTage(zeitraum?.from, zeitraum?.to);

    return (
        <div className="space-y-4 rounded-lg border p-4 text-left">
            <div className="space-y-2">
                <Label>Art des Verleihs</Label>
                <RadioGroup
                    value={art}
                    onValueChange={(wert) => setArt(wert as VerleihArt)}
                    className="flex flex-col gap-3 sm:flex-row sm:gap-6"
                >
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="saison" />
                        Saisonverleih
                    </label>
                    <label className="flex items-center gap-2">
                        <RadioGroupItem value="tag" />
                        Tagesverleih
                    </label>
                </RadioGroup>
                {materialList.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                        Hinweis: Die Preise des bereits erfassten Materials werden beim Wechsel nicht angepasst.
                    </p>
                )}
            </div>

            {art === "tag" && (
                <div className="space-y-2">
                    <Label>Zeitraum</Label>
                    <Popover open={kalenderOffen} onOpenChange={setKalenderOffen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("w-full justify-start text-left font-normal sm:w-[300px]", !zeitraum?.from && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {zeitraum?.from
                                    ? zeitraum.to
                                        ? `${format(zeitraum.from, "dd.MM.yyyy", { locale: de })} – ${format(zeitraum.to, "dd.MM.yyyy", { locale: de })}`
                                        : format(zeitraum.from, "dd.MM.yyyy", { locale: de })
                                    : "Zeitraum wählen"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                selected={zeitraum}
                                onSelect={setZeitraum}
                                numberOfMonths={1}
                                locale={de}
                            />
                        </PopoverContent>
                    </Popover>
                    {tage !== null ? (
                        <p className="text-sm">{tage} {tage === 1 ? "Tag" : "Tage"}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">Ersten Tag anklicken, dann den letzten Tag. Ein Klick allein ergibt einen Tag.</p>
                    )}
                </div>
            )}
        </div>
    );
}
