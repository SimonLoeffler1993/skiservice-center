import { Badge } from "@/components/ui/badge"
import { Wrench, CheckCircle2, PackageCheck } from "lucide-react"
import { cn } from "@/lib/utils"

type AuftragStatus = "0" | "1" | "2" | undefined | null

type AuftragsStatusProps = {
  status: AuftragStatus
  className?: string
}

const statusConfig = {
  0: {
    label: "In Bearbeitung",
    icon: Wrench,
    className: "border-orange-300 bg-orange-50 text-orange-700",
  },
  1: {
    label: "Fertig",
    icon: CheckCircle2,
    className: "border-green-300 bg-green-50 text-green-700",
  },
  2: {
    label: "Abgeholt",
    icon: PackageCheck,
    className: "border-blue-300 bg-blue-50 text-blue-700",
  },
} as const

export function AuftragStatus({ status, className }: AuftragsStatusProps) {
  const config = statusConfig[status ?? 0]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn("gap-1", config.className, className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}