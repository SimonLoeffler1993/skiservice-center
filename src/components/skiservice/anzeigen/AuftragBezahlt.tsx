import { Badge } from "@/components/ui/badge"
import { CircleCheck, CircleX } from "lucide-react"
import { cn } from "@/lib/utils"

type AuftragBezahltProps = {
  bezahlt: string | null | undefined
  className?: string
}

export function AuftragBezahlt({ bezahlt, className }: AuftragBezahltProps) {
  const istBezahlt = bezahlt === "ja"

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1",
        istBezahlt
          ? "border-green-300 bg-green-50 text-green-700"
          : "border-red-300 bg-red-50 text-red-700",
        className
      )}
    >
      {istBezahlt ? (
        <CircleCheck className="h-3 w-3" />
      ) : (
        <CircleX className="h-3 w-3" />
      )}
      {istBezahlt ? "Bezahlt" : "Nicht bezahlt"}
    </Badge>
  )
}