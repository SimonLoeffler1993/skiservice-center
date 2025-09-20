import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";

type UebersichtCeckedProps = {
    checked: boolean;
    setChecked: (checked: boolean) => void;
    fertig: boolean;
}

export default function UebersichtCecked({ checked, setChecked, fertig }: UebersichtCeckedProps) {
    return (
        <div className="mt-4 mb-4">
            <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-green-600 has-[[aria-checked=true]]:bg-green-50 has-[[aria-checked=false]]:border-red-600 has-[[aria-checked=false]]:bg-red-50 dark:has-[[aria-checked=true]]:border-green-900 dark:has-[[aria-checked=true]]:bg-green-950">
                <Checkbox
                    id="toggle-2"
                    checked={checked}
                    onCheckedChange={setChecked}
                    className="data-[state=unchecked]:border-red-600 data-[state=unchecked]:bg-red-50 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:data-[state=checked]:border-green-700 dark:data-[state=checked]:bg-green-700"
                    disabled={!fertig}
                />
                <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                        Daten wurden geprüft
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Die Daten wurden geprüft und sind gültig.
                    </p>
                </div>
            </Label>
        </div>
    )
}
