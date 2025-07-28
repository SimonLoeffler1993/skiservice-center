export const config = {
    // TODO: wen env existiert prüfen das am schluss kein slash ist
    // backendUrl: getEnv('NEXT_PUBLIC_BACKEND_URL') || 'http://localhost:8000',
    backendUrl: process.env.BACKEND_URL ?? 'http://localhost:8000',
};