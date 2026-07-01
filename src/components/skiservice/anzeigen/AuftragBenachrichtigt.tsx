import { Badge } from "@/components/ui/badge"
import { MailCheck, CircleX } from "lucide-react"
import { cn } from "@/lib/utils"

type AuftragBenachrichtigtProps = {
    benachrichtigt: string | null | undefined
    className?: string
}

export function AuftragBenachrichtigt({ benachrichtigt, className }: AuftragBenachrichtigtProps) {
    // In alten daten ist ja unterschiedlich geschrieben
    const istBenachrichtigt = benachrichtigt?.toUpperCase() === "JA"

    return (
        <Badge
            variant="outline"
            className={cn(
                "gap-1",
                istBenachrichtigt
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-red-300 bg-red-50 text-red-700",
                className
            )}
        >
            {istBenachrichtigt ? (
                <MailCheck className="h-3 w-3" />
            ) : (
                <CircleX className="h-3 w-3" />
            )}
            Benachrichtigt
        </Badge>
    )
}