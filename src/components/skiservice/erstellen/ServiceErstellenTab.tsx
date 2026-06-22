import { useCallback, useEffect, useTransition, useState } from 'react';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useFieldArray, useForm, FormProvider } from "react-hook-form";
import ServiceErstellenLinie from "./SkiserviceErstellenLinie";
import ServiceFertigBisPicker from "./ServiceFertigDatumBis";
import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";
import { useQuery } from "@tanstack/react-query";
import { useKundeStore } from "@/stores/useKundeStore";

import { type SkiserviceEintrag, type Antwort, AntwortSchema } from "@/types/skiservicetypes";
import { auftragAnlegen } from '@/lib/auftragaction';
import AuftragGesamtPreis from './AuftragGesamtPreis';
import AuftragAngelegt from './AuftragAngelegt';


export type FormInhalte = {
    skiservices: SkiserviceEintrag[];
    fertigBis: Date | null;
};

export default function ServiceErstellenTab() {
    const { data: skiservicePreise } = useQuery(skiservicesPreiseOptions);
    const { kunde } = useKundeStore();
    const [isPending, startTransition] = useTransition();
    const [antwortErstellen, setAntwortErstellen] = useState<Antwort | null>(null);

    const methods = useForm<FormInhalte>({
        defaultValues: {
            skiservices: [],
            fertigBis: null,
        },
    });

    const { control, handleSubmit, register } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "skiservices",
    });

    const onSubmit = (data: FormInhalte) => {
        // console.log(data);
        startTransition(async () => {
            if (kunde != null && data != null) {
                const res = await auftragAnlegen(kunde.ID, data.skiservices, data.fertigBis)
                const parsedRes = AntwortSchema.safeParse(res)
                // TODO: Fehler beim parsen abfangen
                if (!parsedRes.success) return;

                setAntwortErstellen(parsedRes.data)
                // console.log(res)
            }
        })
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-between items-center">
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

                <ServiceFertigBisPicker />

                {fields.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4 text-center border border-dashed rounded-md">
                        Noch keine Services hinzugefügt.
                    </p>
                ) : (
                    <div className="space-y-2">
                        <div className="grid grid-cols-[2fr_120px_60px_36px] gap-2 items-center">
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
                                <Button type="submit" disabled={kunde === null}>Speichern</Button>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </FormProvider>
    );
}