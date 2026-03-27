import { useQuittung } from "@/hooks/useQuittung";

type QuittungBezahlInfoProps = {
    quittungID: number;
}

export default function QuittungBezahlInfo({ quittungID }: QuittungBezahlInfoProps) {
    const { data: quittung } = useQuittung(quittungID);
    console.log(quittung);
    return (
        <div className="border border-gray-300 flex flex-col gap-2 p-4 rounded-md">
                <span className="text-sm">Betrag: 100,00 €</span>
        </div>
    );
}