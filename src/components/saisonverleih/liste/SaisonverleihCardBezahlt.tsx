import { CheckCircle2, XCircle } from "lucide-react";

type SaisonverleihCardBezahltProps = {
  bezahlt: number | null | undefined;
};

export default function SaisonverleihCardBezahlt({ bezahlt }: SaisonverleihCardBezahltProps) {
  // null oder false = nicht bezahlt
  const isBezahlt = bezahlt === 1 || bezahlt === null || bezahlt === undefined;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium border ${
        isBezahlt
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200"
      }`}
      title={`Bezahlung: ${isBezahlt ? "Bezahlt" : "Nicht bezahlt"}`}
    >
      {isBezahlt ? (
        <CheckCircle2 className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {isBezahlt ? "Bezahlt" : "Nicht bezahlt"}
    </span>
  );
}
