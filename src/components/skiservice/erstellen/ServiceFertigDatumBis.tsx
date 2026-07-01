import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { CalendarIcon } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FormInhalte } from "./ServiceErstellenTab";

type ServiceFertigDatumBisProps = {
    deaktiviert?: boolean
}

export default function ServiceFertigDatumBis({deaktiviert = false}:ServiceFertigDatumBisProps) {
    const { control } = useFormContext<FormInhalte>();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <Controller
            control={control}
            name="fertigBis"
            render={({ field, fieldState }) => (
                <Field className="flex flex-col">
                    <FieldLabel>Fertig bis</FieldLabel>
                    <Popover open={deaktiviert ? false : isPopoverOpen} onOpenChange={(open) => {
                        if (!deaktiviert) {
                            setIsPopoverOpen(open);
                        }
                    }}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                disabled={deaktiviert}
                                className={cn(
                                    "w-[200px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value
                                    ? format(field.value, "dd.MM.yyyy", { locale: de })
                                    : "Datum wählen"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value ?? undefined}
                                onSelect={(date) => field.onChange(date ?? null)}
                                disabled={(date) => date < new Date()}
                                locale={de}
                            />
                        </PopoverContent>
                    </Popover>
                    <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
            )}
        />
    );
}