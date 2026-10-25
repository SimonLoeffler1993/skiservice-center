"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export type SchrittNavigationProps = {
    zurueck?: { titel: string; onClick: () => void };
    weiter?: { titel: string; onClick: () => void; gesperrt?: boolean; hinweis?: string };
    // "oben": kompakt direkt unter den Tabs, "unten": am Ende des Schritts
    position?: "oben" | "unten";
};

// Zurück / Weiter für die Schritte beim Erfassen, damit man nicht zu den Tabs muss
export default function SchrittNavigation({ zurueck, weiter, position = "unten" }: SchrittNavigationProps) {
    if (position === "oben") {
        // Kompakt und immer nebeneinander, auf dem Handy nur "Zurück" / "Weiter"
        return (
            <div className="mb-4 flex items-center justify-between gap-2">
                {zurueck ? (
                    <Button type="button" variant="outline" size="sm" onClick={zurueck.onClick}>
                        <ChevronLeft className="h-4 w-4" />
                        <span>Zurück<span className="hidden sm:inline">: {zurueck.titel}</span></span>
                    </Button>
                ) : (
                    <span />
                )}
                {weiter && (
                    // Hinweis als title; der gesperrte Button selbst nimmt keine Mausereignisse an
                    <span title={weiter.gesperrt ? weiter.hinweis : undefined}>
                        <Button type="button" size="sm" onClick={weiter.onClick} disabled={weiter.gesperrt}>
                            <span>Weiter<span className="hidden sm:inline">: {weiter.titel}</span></span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-2 border-t pt-4">
            {/* Handy: untereinander, "Weiter" oben; ab Tablet nebeneinander */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                {zurueck ? (
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={zurueck.onClick}>
                        <ChevronLeft className="h-4 w-4" />
                        Zurück: {zurueck.titel}
                    </Button>
                ) : (
                    <span className="hidden sm:block" />
                )}
                {weiter && (
                    <Button type="button" className="w-full sm:w-auto" onClick={weiter.onClick} disabled={weiter.gesperrt}>
                        Weiter: {weiter.titel}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {weiter?.hinweis && <p className="text-sm text-muted-foreground sm:text-right">{weiter.hinweis}</p>}
        </div>
    );
}
