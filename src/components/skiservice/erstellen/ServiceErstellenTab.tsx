import { useTransition, useState } from 'react';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import ServiceErstellenLinie from "./SkiserviceErstellenLinie";
import ServiceFertigBisPicker from "./ServiceFertigDatumBis";
import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useKundeStore } from "@/stores/useKundeStore";

import { type SkiserviceEintrag, type Antwort, AntwortSchema } from "@/types/skiservicetypes";
import { auftragAnlegen, type SkiAnlegen } from '@/lib/auftragaction';
import AuftragGesamtPreis from './AuftragGesamtPreis';
import AuftragAngelegt from './AuftragAngelegt';
import { zuBindungsdaten } from '@/types/bindungsdatentypes';


export type FormInhalte = {
    skiservices: SkiserviceEintrag[];
    fertigBis: Date | null;
};

export default function ServiceErstellenTab() {
    useQuery(skiservicesPreiseOptions);
    const { kunde } = useKundeStore();
    const [isPending, startTransition] = useTransition();
    const [antwortErstellen, setAntwortErstellen] = useState<Antwort | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [eingabeFehler, setEingabeFehler] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const methods = useForm<FormInhalte>({
        defaultValues: {
            skiservices: [],
            fertigBis: null,
        },
    });

    const { control, handleSubmit, register, getValues } = methods;

    const { fields, append, remove, insert } = useFieldArray({
        control,
        name: "skiservices",
    });

    const onSubmit = (data: FormInhalte) => {
        if (isSubmitting || kunde == null) return;

        // Jede Zeile braucht einen Service und einen gültigen Preis
        const fehlerhaft = data.skiservices.findIndex((s) => !s.service || Number.isNaN(s.preis) || s.preis < 0);
        if (fehlerhaft !== -1) {
            setEingabeFehler(`Zeile ${fehlerhaft + 1}: Bitte einen Service auswählen und einen gültigen Preis eingeben.`);
            return;
        }

        // Bindungsdaten prüfen und umwandeln, nur bei Bindungscheck
        const skis: SkiAnlegen[] = [];
        for (const [i, eintrag] of data.skiservices.entries()) {
            const { daten, fehler } = eintrag.bindung_check ? zuBindungsdaten(eintrag.bindungsdaten) : { daten: null, fehler: null };
            if (fehler) {
                setEingabeFehler(`Zeile ${i + 1}: ${fehler}`);
                return;
            }
            skis.push({
                service: eintrag.service,
                preis: eintrag.preis,
                bindung_check: eintrag.bindung_check,
                bindung_preis: eintrag.bindung_preis,
                bindungsdaten: daten,
                vorlage_id: daten ? eintrag.bindungsdaten?.vorlage_id ?? null : null,
            });
        }
        setEingabeFehler(null);

        setIsSubmitting(true);

        startTransition(async () => {
            try {
                // Datum im Browser formatieren, sonst verschiebt sich der Tag auf einem Server in UTC
                const fertigBis = data.fertigBis ? data.fertigBis.toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                }) : null;
                const res = await auftragAnlegen(kunde.ID, skis, fertigBis)
                const parsedRes = AntwortSchema.safeParse(res)
                if (!parsedRes.success) {
                    setEingabeFehler("Unerwartete Antwort vom Server.");
                    return;
                }

                setAntwortErstellen(parsedRes.data)
                if (parsedRes.data.success) {
                    // Liste neu laden, damit der neue Auftrag sofort erscheint
                    queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
                    queryClient.invalidateQueries({ queryKey: ["bindungsdaten", kunde.ID] });
                }
            } finally {
                setIsSubmitting(false);
            }
        })
    };

    function handleDuplicateService(index: number) {
        const aktuell = getValues(`skiservices.${index}`);
        if (!aktuell) return;

        // Tiefe Kopie, damit die Bindungsdaten nicht zwischen den Zeilen geteilt werden
        insert(index + 1, structuredClone(aktuell));
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                    <AuftragGesamtPreis />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ service: "", preis: 0, bindung_check: false, bindung_preis: 0 })}
                        disabled={antwortErstellen?.success}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Service hinzufügen
                    </Button>
                </div>

                <ServiceFertigBisPicker deaktiviert={antwortErstellen?.success} />

                {fields.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4 text-center border border-dashed rounded-md">
                        Noch keine Services hinzugefügt.
                    </p>
                ) : (
                    <div className="space-y-2">
                        <div className="hidden md:grid grid-cols-[36px_2fr_120px_60px_36px] gap-2 items-center">
                            <span />
                            <Label className="text-xs text-muted-foreground">Service</Label>
                            <Label className="text-xs text-muted-foreground">Preis (€)</Label>
                            <Label className="text-xs text-muted-foreground">Bindung</Label>
                            <span />
                        </div>

                        {fields.map((field, index) => (
                            <ServiceErstellenLinie
                                key={field.id}
                                index={index}
                                register={register}
                                control={control}
                                onRemove={() => remove(index)}
                                deaktiviert={antwortErstellen?.success} 
                                onDuplicate={() => handleDuplicateService(index)}
                            />
                        ))}
                    </div>
                )}

                {fields.length > 0 && (
                    <div className="flex justify-end pt-2">
                        {isPending ? (
                            <p className="text-sm text-muted-foreground">Wird erstellt…</p>
                        ) : antwortErstellen?.success ? (
                            <AuftragAngelegt serviceAuftragID={antwortErstellen.data.id} />
                        ) : (
                            <div>
                                {antwortErstellen?.error && (
                                    <p className="text-sm text-destructive">{antwortErstellen.error}</p>
                                )}
                                {eingabeFehler && (
                                    <p className="text-sm text-destructive">{eingabeFehler}</p>
                                )}
                                <Button type="submit" disabled={kunde === null || isPending || isSubmitting}>Speichern</Button>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </FormProvider>
    );
}