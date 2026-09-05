export type ApiAntwort<T> =
    | { success: true; data: T }
    | { success: false; error: string };