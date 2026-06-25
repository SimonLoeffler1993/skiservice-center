"use client"

import { BadgeCheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { setBindungChecked } from "@/lib/auftragaction";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { auftragDetailsOptions } from "@/hooks/useAuftragDetailsOptions";

type BindungsProps = {
    skiid: number;
    auftragid: number;
    Check: boolean;
    Status?: boolean;
}

export default function SkiBindungPruefenButton({ skiid, auftragid, Check, Status }: BindungsProps) {
    const [isPendig, startTransition] = useTransition();
    const queryClient = useQueryClient()


    function handleBindungChecked() {
        startTransition(async () => {
            const checked = await setBindungChecked([skiid])
            console.log("Bindung Checked: ", checked)
            if (checked){
                queryClient.invalidateQueries({ queryKey: auftragDetailsOptions(auftragid).queryKey })
            }
        })
    }
    // So wird es nur angezeigt wen
    // Bindung vorhanden und nicht geprüft
    if (Check && !Status) {
        return (
            <Button className="h-6 text-xs" size="sm" variant="outline" onClick={handleBindungChecked} disabled={isPendig}>
                {isPendig ? (
                    "Bindung wird geprüft"
                ) : (
                    <>
                        Bindung
                        <BadgeCheckIcon />
                    </>
                )}
            </Button>
        )
    }

    return null
}