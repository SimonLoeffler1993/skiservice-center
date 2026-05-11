import { Beleg } from "@/types/belegetypes";

type BelegCardProps = {
    beleg: Beleg;
};

const typeLabels: Record<Beleg["voucherType"], string> = {
    salesinvoice: "Rechnung",
    salescreditnote: "Gutschrift",
    purchaseinvoice: "Eingangsrechnung",
    purchasecreditnote: "Eingangsgutschrift",
    invoice: "Rechnung",
    downpaymentinvoice: "Anzahlungsrechnung",
    creditnote: "Gutschrift",
    orderconfirmation: "Auftragsbestätigung",
    quotation: "Angebot",
    deliverynote: "Lieferschein",
};

const statusLabels: Record<Beleg["voucherStatus"], string> = {
    draft: "Entwurf",
    open: "Offen",
    paid: "Bezahlt",
    paidoff: "Ausgeglichen",
    voided: "Storniert",
    transferred: "Übertragen",
    sepadebit: "SEPA-Lastschrift",
    overdue: "Überfällig",
    accepted: "Akzeptiert",
    rejected: "Abgelehnt",
    unchecked: "Ungeprüft",
};

const statusStyles: Record<Beleg["voucherStatus"], string> = {
    draft: "bg-slate-100 text-slate-800",
    open: "bg-amber-100 text-amber-800",
    paid: "bg-emerald-100 text-emerald-800",
    paidoff: "bg-emerald-100 text-emerald-800",
    voided: "bg-rose-100 text-rose-800",
    transferred: "bg-indigo-100 text-indigo-800",
    sepadebit: "bg-cyan-100 text-cyan-800",
    overdue: "bg-red-100 text-red-800",
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
    unchecked: "bg-slate-100 text-slate-800",
};

function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

export default function BelegCard({ beleg }: BelegCardProps) {
    return (
        <label className="block cursor-pointer">
            <input
                type="radio"
                name="selectedBeleg"
                value={beleg.id}
                className="sr-only peer"
            />
            <article className="rounded-2xl border px-4 pt-3 pb-4 transition
                border-slate-200 bg-white
                hover:shadow-md hover:border-slate-300 hover:bg-slate-50
                peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:ring-2 peer-checked:ring-blue-200">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">
                                {typeLabels[beleg.voucherType]}
                            </span>
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[beleg.voucherStatus]}`}>
                                {statusLabels[beleg.voucherStatus]}
                            </span>
                        </div>
                        <h2 className="text-base font-semibold text-slate-900">{beleg.contactName}</h2>
                        <p className="text-xs text-slate-400">{beleg.voucherNumber}</p>
                    </div>

                    <div className="text-right shrink-0">
                        <p className="text-lg font-semibold text-slate-900">
                            {formatCurrency(beleg.totalAmount, beleg.currency)}
                        </p>
                        {beleg.openAmount != null && beleg.openAmount > 0 && (
                            <p className="text-xs text-slate-500">
                                Offen: <span className="font-medium text-slate-700">{formatCurrency(beleg.openAmount, beleg.currency)}</span>
                            </p>
                        )}
                    </div>
                </div>
            </article>
        </label>
    );
}