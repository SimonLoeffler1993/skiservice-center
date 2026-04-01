"use client";

import { AlertTriangleIcon } from "lucide-react"

import QuittungBezahlInfo from "./QuittungBezahlInfo";
import { Suspense } from "react";

type QuttungsProps = {
    quittungID: number | null | undefined;
}

export default function QuittungKurzInfo({ quittungID }: QuttungsProps) {
    // Wenn es keine QuittungID gibt
    if (!quittungID) {
        return (
            <div className="border border-amber-200 flex flex-col-2 gap-2 p-4 rounded-md bg-amber-100">
                < AlertTriangleIcon className="h-5 w-5 text-amber-700" />
                <span className="text-sm text-amber-700">Es ist keine Quittung vorhanden.</span>
            </div>
        )
    }

    // Wenn es ein QuittungID gibt
    return (
        <Suspense fallback={<div className="text-sm text-gray-500">Lade Bezahlinformationen...</div>}>
            <QuittungBezahlInfo quittungID={quittungID} />
        </Suspense>
    );
}