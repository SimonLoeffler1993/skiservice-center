import SkiserviceFertigScanner from "@/components/skiservice/fertigstellen/scanner"
import { getConfig } from "@/lib/config"

export const dynamic = 'force-dynamic'; 

export default function SkiServiceFertig() {
    const config = getConfig();
    // console.log("Backend URL:", config.backendUrl);
    return (
        <>
            <SkiserviceFertigScanner backendUrl={config.backendUrl} />
        </>
    )
}