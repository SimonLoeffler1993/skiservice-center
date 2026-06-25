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
import { Trash2 } from "lucide-react";
import { Control, UseFormRegister, useWatch, useFormContext } from "react-hook-form";
import { FormInhalte } from "./ServiceErstellenTab";
import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";
import { useQuery } from "@tanstack/react-query";

type SkiserviceErstellenLinieProps = {
    index: number;
    register: UseFormRegister<FormInhalte>;
    control: Control<FormInhalte>;
    onRemove: () => void;
    deaktiviert?: boolean;
};

export default function ServiceErstellenLinie({ index, register, control, onRemove, deaktiviert=false }: SkiserviceErstellenLinieProps) {
    const { data: skiservicePreise } = useQuery(skiservicesPreiseOptions);

    const bindung_check = useWatch({
        control,
        name: `skiservices.${index}.bindung_check`,
    });

    // Bindungspreis lesen, als fallback 0
    const serviceBindung = skiservicePreise?.find((s) => s.Bindung)?.Preis ?? 0

    const { setValue } = useFormContext<FormInhalte>();

    const handleServiceChange = (serviceId: string) => {
        const selected = skiservicePreise?.find((s) => String(s.id) === serviceId);
        
        if (!selected) return;
        setValue(`skiservices.${index}.service`, selected.Service);
        setValue(`skiservices.${index}.preis`, selected.Preis);
    };

    return (
        <div className="grid grid-cols-[2fr_120px_60px_36px] gap-2 items-center">
            <Select onValueChange={handleServiceChange} disabled={deaktiviert}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Service auswählen..." />
                </SelectTrigger>
                <SelectContent className="w-full">
                    {skiservicePreise?.filter((S) => !S.Bindung).map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                            {s.Service}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                {...register(`skiservices.${index}.preis`, { valueAsNumber: true })}
                placeholder="0.00"
                type="number"
                min={0}
                step={0.01}
                disabled={deaktiviert}
            />
            <div className="flex justify-center">
                <Checkbox
                    checked={bindung_check ?? false}
                    disabled={deaktiviert}
                    onCheckedChange={(checked) => {
                        const isChecked = checked === true
                        setValue(`skiservices.${index}.bindung_check`, isChecked)
                        setValue(`skiservices.${index}.bindung_preis`, isChecked ? serviceBindung : 0);
                    }}
                />
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="text-muted-foreground hover:text-destructive"
                disabled={deaktiviert}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}