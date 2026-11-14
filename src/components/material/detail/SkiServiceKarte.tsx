"use client";

import { format, parseISO } from "date-fns";
import { Pencil, Plus, Wrench } from "lucide-react";

import { DetailKarte } from "@/components/detail/DetailKopf";
import { Button } from "@/components/ui/button";
import { euro } from "@/lib/utils";
import { SkiService } from "@/types/materialdetailtypes";
import SkiServiceDialog from "./SkiServiceDialog";

type SkiServiceKarteProps = {
    skiID: number;
    services: SkiService[];
    abzugStandard: number;
    onGeaendert: () => void;
};

// Services am Leihski, neueste zuerst
export default function SkiServiceKarte({ skiID, services, abzugStandard, onGeaendert }: SkiServiceKarteProps) {
    return (
        <DetailKarte titel={`Services (${services.length})`} icon={Wrench}>
            {services.length === 0 ? (
                <p className="text-sm text-muted-foreground">Noch kein Service eingetragen.</p>
            ) : (
                <ul className="divide-y">
                    {services.map((service) => (
                        <li key={service.ID} className="flex items-center gap-3 py-2 first:pt-0">
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{service.Bezeichnung}</p>
                                <p className="text-sm text-muted-foreground">{format(parseISO(service.Datum), "dd.MM.yyyy")}</p>
                            </div>
                            <span className="shrink-0 tabular-nums">{euro.format(-service.Abzug)}</span>
                            <SkiServiceDialog skiID={skiID} service={service} abzugStandard={abzugStandard} onGeaendert={onGeaendert}>
                                <Button type="button" variant="ghost" size="icon" title="Service ändern">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </SkiServiceDialog>
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-3">
                <SkiServiceDialog skiID={skiID} abzugStandard={abzugStandard} onGeaendert={onGeaendert}>
                    <Button type="button" variant="outline" className="h-10">
                        <Plus className="h-4 w-4" />
                        Service eintragen
                    </Button>
                </SkiServiceDialog>
            </div>
        </DetailKarte>
    );
}
