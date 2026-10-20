import { SaisonsNamen } from "@/types/saison";

type AktuelleSaisonProps = {
    saison: SaisonsNamen;
}

export default function AktuelleSaison({ saison }: AktuelleSaisonProps) {
    return (
        <span className="inline-flex items-center rounded-full border border-neutral-300 bg-neutral-100 px-4 py-1.5 text-base font-medium text-neutral-700">
            {saison.Name}
        </span>
    );
}
