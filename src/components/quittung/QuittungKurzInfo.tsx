import { AlertTriangleIcon } from "lucide-react"

import QuittungBezahlInfo from "./QuittungBezahlInfo";
import { Suspense } from "react";

type QuttungsProps = {
    quittungID: number | null | undefined;
}

export default function QuittungKurzInfo({ quittungID }: QuttungsProps) {
    if (!quittungID) {
        return (
            <div className="border border-amber-200 flex flex-col-2 gap-2 p-4 rounded-md bg-amber-100">
                < AlertTriangleIcon className="h-5 w-5 text-amber-700" />
                <span className="text-sm text-amber-700">Es ist keine Quittung vorhanden.</span>
            </div>
        )
    }

    return (
        <div className="border border-gray-300 flex flex-col gap-2 p-4 rounded-md">
            <div className="flex items-center gap-2">
                <p>Quittung ID: {quittungID}</p>
                <span className="font-bold">Quittung 25/26Q322</span>
                <span className="text-sm text-gray-500">vom 01.01.2024</span>
            </div>
            <div className="flex items-center gap-4">
                <Suspense fallback={<div className="text-sm text-gray-500">Lade Bezahlinformationen...</div>}>
                    <QuittungBezahlInfo quittungID={quittungID}/>
                </Suspense>
                
            </div>
        </div>
    );
}