import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Copy, Trash2 } from "lucide-react";
import { Control, Controller, UseFormRegister, useWatch, useFormContext } from "react-hook-form";
import { FormInhalte } from "./ServiceErstellenTab";
import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";
import { useQuery } from "@tanstack/react-query";
import { useKundeStore } from "@/stores/useKundeStore";
import BindungsdatenFelder from "../bindung/BindungsdatenFelder";

type SkiserviceErstellenLinieProps = {
    index: number;
    register: UseFormRegister<FormInhalte>;
    control: Control<FormInhalte>;
    onRemove: () => void;
    deaktiviert?: boolean;
    onDuplicate?: () => void;
};

export default function ServiceErstellenLinie({ index, register, control, onRemove, deaktiviert = false, onDuplicate }: SkiserviceErstellenLinieProps) {
    const { data: skiservicePreise, isLoading, error } = useQuery(skiservicesPreiseOptions);

    const bindung_check = useWatch({
        control,
        name: `skiservices.${index}.bindung_check`,
    });

    // Gewählter Service, damit das Dropdown auch nach dem Duplizieren den Service anzeigt
    const service = useWatch({
        control,
        name: `skiservices.${index}.service`,
    });

    const { setValue } = useFormContext<FormInhalte>();
    const { kunde } = useKundeStore();

    if (isLoading) return <p>Service Preise werden geladen...</p>

    if (error) return <p className="text-red-500">Fehler beim Laden der Service Preise: {error.message}</p>

    if (!skiservicePreise?.success) return <p>Service Preise konnten nicht geladen werden</p>

    // Bindungspreis lesen, als fallback 0
    const serviceBindung = skiservicePreise.data.find((s) => s.Bindung)?.Preis ?? 0

    const handleServiceChange = (serviceId: string) => {
        const selected = skiservicePreise.data.find((s) => String(s.id) === serviceId);

        if (!selected) return;
        setValue(`skiservices.${index}.service`, selected.Service, { shouldValidate: true });
        setValue(`skiservices.${index}.preis`, selected.Preis, { shouldValidate: true });
    };

    const serviceAuswahl = skiservicePreise.data.filter((s) => !s.Bindung);
    const gewaehlteServiceId = serviceAuswahl.find((s) => s.Service === service)?.id;

    // Mobil: Zeile 1 Kopieren | Service | Löschen, Zeile 2 Preis | Bindung
    // Ab md: alles in einer Zeile
    return (
        <div className="grid grid-cols-[36px_1fr_auto_36px] md:grid-cols-[36px_2fr_120px_60px_36px] gap-2 items-center rounded-md border p-2 md:border-0 md:p-0">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onDuplicate}
                className="order-1 text-muted-foreground"
                disabled={deaktiviert}
                title="Duplizieren"
            >
                <Copy className="h-4 w-4" />
            </Button>
            <Select
                value={gewaehlteServiceId !== undefined ? String(gewaehlteServiceId) : ""}
                onValueChange={handleServiceChange}
                disabled={deaktiviert}
            >
                <SelectTrigger className="order-2 col-span-2 w-full md:col-span-1" aria-invalid={!service}>
                    <SelectValue placeholder="Service auswählen..." />
                </SelectTrigger>
                <SelectContent className="w-full">
                    {serviceAuswahl.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                            {s.Service}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                {...register(`skiservices.${index}.preis`, { valueAsNumber: true })}
                className="order-4 col-start-2 md:order-3 md:col-start-auto"
                aria-label="Preis"
                placeholder="0.00"
                type="number"
                min={0}
                step={0.01}
                disabled={deaktiviert}
            />
            <label className="order-5 flex items-center justify-center gap-2 md:order-4">
                <Checkbox
                    checked={bindung_check ?? false}
                    disabled={deaktiviert}
                    onCheckedChange={(checked) => {
                        const isChecked = checked === true
                        setValue(`skiservices.${index}.bindung_check`, isChecked)
                        setValue(`skiservices.${index}.bindung_preis`, isChecked ? serviceBindung : 0);
                    }}
                />
                <span className="text-sm md:hidden">Bindung</span>
            </label>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="order-3 text-muted-foreground hover:text-destructive md:order-5"
                disabled={deaktiviert}
                title="Entfernen"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            {bindung_check && (
                <div className="order-6 col-span-full">
                    <Controller
                        control={control}
                        name={`skiservices.${index}.bindungsdaten`}
                        render={({ field }) => (
                            <BindungsdatenFelder
                                idPrefix={`zeile-${index}`}
                                wert={field.value}
                                onChange={field.onChange}
                                kundeId={kunde?.ID}
                                deaktiviert={deaktiviert}
                            />
                        )}
                    />
                </div>
            )}
        </div>
    );
}