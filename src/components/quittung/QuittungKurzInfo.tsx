"use client";

import { AlertTriangleIcon } from "lucide-react"

import QuittungBezahlInfo from "./QuittungBezahlInfo";

type QuttungsProps = {
    quittungID: number | null | undefined;
}

export default function QuittungKurzInfo({ quittungID }: QuttungsProps) {
    // Wenn es keine QuittungID gibt
    if (!quittungID) {
        return (
            <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-100 px-3 py-2">
                <AlertTriangleIcon className="h-5 w-5 shrink-0 text-amber-700" />
                <span className="text-sm text-amber-700">Es ist keine Quittung vorhanden.</span>
            </div>
        )
    }

    // Wenn es ein QuittungID gibt
    return <QuittungBezahlInfo quittungID={quittungID} />;
}