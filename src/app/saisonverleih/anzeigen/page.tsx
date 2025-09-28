import SaisonverleihListe from "@/components/saisonverleih/liste/SaisonverleihListe";
import { Snowflake } from "lucide-react";
import { Suspense } from "react";

// Design-only mock data
type RentalCard = {
    id: number;
    kunde: string;
    ski: number;
    schuh: number;
    stock: number;
    status: "unterwegs" | "zurück";
    bezahlt: boolean;
};

const rentals: RentalCard[] = [
    { id: 101, kunde: "Müller Anna", ski: 1, schuh: 1, stock: 2, status: "unterwegs", bezahlt: false },
    { id: 102, kunde: "Meier Jonas", ski: 2, schuh: 2, stock: 2, status: "zurück", bezahlt: true },
    { id: 103, kunde: "Schneider Lea", ski: 1, schuh: 0, stock: 0, status: "unterwegs", bezahlt: true },
    { id: 104, kunde: "Koch Daniel", ski: 0, schuh: 1, stock: 0, status: "zurück", bezahlt: false },
];


function CountPill({ label, value, Icon }: { label: string; value: number; Icon: React.ComponentType<{ className?: string }> }) {
    return (
        <span className="text-xs inline-flex items-center gap-1 font-semibold text-foreground rounded-md border px-2 py-1">
            <Icon className="h-3.5 w-3.5" /> {label}: {value}
        </span>
    );
}

export default function SaisonVerleiAnzeige() {
    // TODO Menuleiste
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-muted-foreground" />
                    <h1 className="text-xl font-semibold">Saisonverleih</h1>
                </div>
            </div>
            <Suspense fallback={<p>Saisonverleihliste wird zusammen gekruschelt...</p>}>
                <SaisonverleihListe />
            </Suspense>
        </section>
    )
}

// export default function SaisonVerleiAnzeige() {
//   return (
//     <section className="space-y-4">
//       {/* Header */}
//       <div className="flex items-center justify-between gap-2">
//         <div className="flex items-center gap-2">
//           <Snowflake className="h-5 w-5 text-muted-foreground" />
//           <h1 className="text-xl font-semibold">Saisonverleih</h1>
//         </div>
//       </div>

//       {/* List/Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {rentals.map((r) => (
//           <Card key={r.id}>
//             <div className="p-3 m-2">
//               {/* Row: Kunde + Badges */}
//               <div className="flex items-start justify-between gap-3">
//                 <div className="space-y-1">
//                   <div className="text-base font-semibold leading-tight flex items-center gap-2">
//                     <User className="h-4 w-4 text-muted-foreground" />
//                     {r.kunde}
//                   </div>
//                   <div className="text-xs text-muted-foreground">Ausrüstung #{r.id}</div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                   <StatusBadge status={r.status} />
//                   <PaymentBadge bezahlt={r.bezahlt} />
//                 </div>
//               </div>

//               {/* Row: Summary counts */}
//               <div className="mt-3 text-sm text-muted-foreground flex flex-wrap items-center gap-2">
//                 <CountPill label="Ski" value={r.ski} Icon={Snowflake} />
//                 <CountPill label="Schuh" value={r.schuh} Icon={Tag} />
//                 <CountPill label="Stock" value={r.stock} Icon={Package} />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }