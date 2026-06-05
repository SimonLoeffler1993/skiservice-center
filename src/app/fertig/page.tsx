import SkiserviceFertigScanner from "@/components/skiservice/fertigstellen/scanner"
import { getConfig } from "@/lib/config"


export default function SkiServiceFertig() {
    const config = getConfig();

    return (
        <>
            <SkiserviceFertigScanner backendUrl={config.backendUrl} />
        </>
    )
}