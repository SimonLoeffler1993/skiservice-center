import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";

export default function UebersichtBemerkung() {
    const { bemerkung, setBemerkung } = useSaisonverleihContext();
    return (
        <div className="grid w-full gap-3">
            <Label>Bemerkung</Label>
            <Textarea className="h-24" placeholder="Bemerkung" value={bemerkung} onChange={(e) => setBemerkung(e.target.value)} />
        </div>
    );
}