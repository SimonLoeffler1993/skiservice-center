import { Info } from 'lucide-react';

type UebersichtBemerkungProps = {
    bemerkung: string;
};

export default function SaisonVerleiAnzeigeUebersichtBemerkung({ bemerkung }: UebersichtBemerkungProps) {
    return (
        <div className="border rounded-md border-gray-200 p-4 flex items-center gap-2">
            <Info className="h-4 w-4" />
            <p className="ml-2">{bemerkung}</p>
        </div>
    );
}