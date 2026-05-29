import SkiserviceFertigScanner from "@/components/skiservice/fertigstellen/scanner"
import { config } from "@/lib/config"


export default function SkiServiceFertig() {
   
    return (
        <>
            <SkiserviceFertigScanner backendUrl={config.backendUrl} />
        </>
    )
}