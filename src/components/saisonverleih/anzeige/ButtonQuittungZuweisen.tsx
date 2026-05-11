import DialogQuittungZuweisen from "@/components/quittung/DialogQuttungZuweisen";

type ButtonQuittungZuweisenProps = {
    quittungID: number | null | undefined;
}

export default function ButtonQuittungZuweisen({ quittungID }: ButtonQuittungZuweisenProps) {
    if (!quittungID) {
        return <DialogQuittungZuweisen />
    }
    return null;
}