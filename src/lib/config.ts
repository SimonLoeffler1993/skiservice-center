export const config = {
    // TODO: wen env existiert prüfen das am schluss kein slash ist
    // backendUrl: getEnv('NEXT_PUBLIC_BACKEND_URL') || 'http://localhost:8000',
    backendUrl: process.env.BACKEND_URL ?? 'http://localhost:8000',
};

export function getConfig() {
    return {
        backendUrl: process.env.BACKEND_URL ?? 'http://localhost:8000',
        // Webflasher der Hardware-Scanner (GitHub Pages), mit WEBFLASHER_URL überschreibbar
        webflasherUrl: process.env.WEBFLASHER_URL || 'https://simonloeffler1993.github.io/scanner_project/',
    };
}