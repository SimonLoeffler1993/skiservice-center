"use client"
import { skiEttikettenDrucken } from "@/lib/auftragaction";
import { Ski } from "@/types/skiservicetypes";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import SkiEttikettenDruckSubmit from "./SkiEttikettenDruckSubmit";

type SkiEttikettenDruckButtonProps = {
    skis: Ski[];
};

export default function SkiEttikettenDruckButton({ skis }: SkiEttikettenDruckButtonProps) {


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Ettiketen drucken</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
                <p>welche Ettiketten sollen gedruckt werden?</p>
                <form action={skiEttikettenDrucken}>
                    <FieldGroup>
                        {skis.map((ski) => (
                            <Field key={ski.id} orientation={"horizontal"}>
                                <Checkbox id={`ski-${ski.id}`} name="skiIds" value={ski.id} defaultChecked />
                                <Label htmlFor={`ski-${ski.id}`}>{ski.name}</Label>
                            </Field>
                            // <li key={ski.id}>{ski.name}</li>
                        ))}
                    </FieldGroup>
                    <SkiEttikettenDruckSubmit />
                </form>
            </PopoverContent>
        </Popover>
    )
}