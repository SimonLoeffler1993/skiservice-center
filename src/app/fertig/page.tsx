import SkiserviceFertigScanner from "@/components/skiservice/fertigstellen/scanner"
import { config } from "@/lib/config"


export default function SkiServiceFertig() {
   
    return (
        <div>
            <h1>Skiservice Fertigstellen</h1>
            <SkiserviceFertigScanner backendUrl={config.backendUrl} />
        </div>
    )
}