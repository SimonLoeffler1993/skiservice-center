"use client"
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Spinner } from "@/components/ui/spinner"

export default function SkiEttikettenDruckSubmit() {
    const {pending} = useFormStatus()

    return (
        <Button type="submit" className="mt-2" disabled={pending}>
            {pending ? <Spinner /> : "Drucken"}
        </Button>
    )
}