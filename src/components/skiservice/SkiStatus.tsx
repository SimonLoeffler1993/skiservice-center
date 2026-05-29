// SkiStatus.tsx

type SkiStatusProps = {
    status: number | null | undefined; // 0 = In Bearbeitung, 1 = Fertig, 2 = Abgeholt
};

const statusConfig = {
    0: {
        label: "In Bearbeitung",
        dot: "bg-amber-500",
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    },
    1: {
        label: "Fertig",
        dot: "bg-green-600 dark:bg-green-400",
        badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    2: {
        label: "Abgeholt",
        dot: "bg-blue-500 dark:bg-blue-400",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
};

function toSkiStatus(status: number | null | undefined): 0 | 1 | 2 {
    if (status === 1) return 1;
    if (status === 2) return 2;
    return 0;
}

export default function SkiStatus({ status }: SkiStatusProps) {
    const config = statusConfig[toSkiStatus(status)];

    return (
        <div className="flex justify-center">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                {config.label}
            </span>
        </div>
    );
}