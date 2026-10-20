"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";
import { aendereSki, fuegeSkiHinzu, SkiDaten } from "@/lib/bearbeitenactions";
import { Ski } from "@/types/skiservicetypes";
import { useAuftragAktualisieren } from "./useAuftragAktualisieren";

type SkiFormDialogProps = {
    auftragId: number;
    // Ohne Ski wird ein neuer Ski hinzugefügt
    ski?: Ski;
    // Bezahlte Aufträge: nur Kommentar änderbar
    bezahlt: boolean;
};

type FormWerte = {
    service: string;
    preis: number;
    komentar: string;
    bindung_check: boolean;
};

export default function SkiFormDialog({ auftragId, ski, bezahlt }: SkiFormDialogProps) {
    const [offen, setOffen] = useState(false);
    const [fehler, setFehler] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const aktualisieren = useAuftragAktualisieren(auftragId);
    const queryClient = useQueryClient();
    const { data: preise } = useQuery(skiservicesPreiseOptions);

    const servicePreise = preise?.success ? preise.data.filter((p) => !p.Bindung) : [];
    const bindungPreis = preise?.success ? preise.data.find((p) => p.Bindung)?.Preis ?? 0 : 0;

    const standardWerte: FormWerte = {
        service: ski?.service ?? "",
        preis: ski?.preis ?? 0,
        komentar: ski?.komentar ?? "",
        bindung_check: ski?.bindung_check ?? false,
    };
    const { register, control, handleSubmit, reset, setValue, watch } = useForm<FormWerte>({ defaultValues: standardWerte });
    const service = watch("service");

    function onSubmit(werte: FormWerte) {
        if (!werte.service || Number.isNaN(werte.preis) || werte.preis < 0) {
            setFehler("Bitte einen Service und einen gültigen Preis angeben.");
            return;
        }
        const daten: SkiDaten = {
            service: werte.service,
            preis: werte.preis,
            komentar: werte.komentar || null,
            bindung_check: werte.bindung_check,
            // Vorhandenen Bindungspreis behalten, sonst aktuellen Preis aus der Preisliste
            bindung_preis: werte.bindung_check ? (ski?.bindung_check ? ski.bindung_preis : bindungPreis) : 0,
        };
        startTransition(async () => {
            const antwort = ski
                ? await aendereSki(auftragId, ski.id, bezahlt ? { komentar: daten.komentar } : daten)
                : await fuegeSkiHinzu(auftragId, daten);
            if (!antwort.success) {
                setFehler(antwort.error);
                return;
            }
            aktualisieren(antwort.data);
            queryClient.invalidateQueries({ queryKey: ["skiserviceList"] });
            setOffen(false);
        });
    }

    return (
        <Dialog
            open={offen}
            onOpenChange={(wert) => {
                setOffen(wert);
                setFehler(null);
                if (wert) reset(standardWerte);
            }}
        >
            <DialogTrigger asChild>
                {ski ? (
                    <Button type="button" variant="ghost" size="icon" title="Bearbeiten">
                        <Pencil className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button type="button" variant="outline" size="sm" disabled={bezahlt} title={bezahlt ? "Auftrag ist bezahlt" : undefined}>
                        <Plus className="h-4 w-4" />
                        Ski hinzufügen
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{ski ? `Ski ${ski.name ?? ""} bearbeiten` : "Ski hinzufügen"}</DialogTitle>
                </DialogHeader>
                <form id={`ski-form-${ski?.id ?? "neu"}`} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {bezahlt && (
                        <p className="text-sm text-muted-foreground">Der Auftrag ist bezahlt, nur der Kommentar kann geändert werden.</p>
                    )}
                    <div className="space-y-2">
                        <Label>Service</Label>
                        <Select
                            value={String(servicePreise.find((p) => p.Service === service)?.id ?? "")}
                            onValueChange={(id) => {
                                const preis = servicePreise.find((p) => String(p.id) === id);
                                if (!preis) return;
                                setValue("service", preis.Service);
                                setValue("preis", preis.Preis);
                            }}
                            disabled={bezahlt}
                        >
                            <SelectTrigger className="w-full">
                                {/* Service, der nicht (mehr) in der Preisliste steht, trotzdem anzeigen */}
                                <SelectValue placeholder={service || "Service auswählen..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {servicePreise.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>{p.Service}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`ski-preis-${ski?.id ?? "neu"}`}>Preis (€)</Label>
                        <Input
                            id={`ski-preis-${ski?.id ?? "neu"}`}
                            type="number"
                            step="0.01"
                            min={0}
                            disabled={bezahlt}
                            {...register("preis", { valueAsNumber: true })}
                        />
                    </div>
                    <label className="flex items-center gap-2">
                        <Controller
                            control={control}
                            name="bindung_check"
                            render={({ field }) => (
                                <Checkbox checked={field.value} onCheckedChange={(wert) => field.onChange(wert === true)} disabled={bezahlt} />
                            )}
                        />
                        <span className="text-sm">Bindung prüfen / einstellen</span>
                    </label>
                    <div className="space-y-2">
                        <Label htmlFor={`ski-kommentar-${ski?.id ?? "neu"}`}>Kommentar</Label>
                        <Textarea id={`ski-kommentar-${ski?.id ?? "neu"}`} rows={2} {...register("komentar")} />
                    </div>
                    {fehler && <p className="text-sm text-destructive">{fehler}</p>}
                </form>
                <DialogFooter>
                    <Button type="submit" form={`ski-form-${ski?.id ?? "neu"}`} disabled={isPending}>
                        {isPending ? "Speichern..." : "Speichern"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
