type SkiBindungProps = {
    BindungCheck: boolean;
    BindungStatus?: boolean;
};

export default  function SkiBindung({ BindungCheck, BindungStatus }: SkiBindungProps) {
    // Wen kein Bendungscheck, dann nichts anzeigen 
    // div als Platzhalter, damit die Zeile nicht springt, wenn Bindungscheck aktiviert wird
    if (!BindungCheck) {
        return <div></div>
    }

    return (
        <div>
            {BindungStatus ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                    Bindungscheck
                </span>
            ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                    Bindungscheck
                </span>
            )}
        </div>
    );
}