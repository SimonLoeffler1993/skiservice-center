// Automatischer Name der Gerätesitzung aus dem User-Agent (nur auf dem Server: Server Actions, Route Handler).
// Umbenennen geht unter Verwalten → Geräte.

import { headers } from "next/headers";

const BROWSER: [RegExp, string][] = [
    [/Edg\//, "Edge"],
    [/OPR\/|Opera/, "Opera"],
    [/SamsungBrowser/, "Samsung Internet"],
    [/Firefox\/|FxiOS/, "Firefox"],
    [/Chrome\/|CriOS/, "Chrome"],
    [/Safari\//, "Safari"],
];

const SYSTEM: [RegExp, string][] = [
    [/iPad/, "iPad"],
    [/iPhone/, "iPhone"],
    [/Android/, "Android"],
    [/Windows/, "Windows"],
    [/Mac OS X|Macintosh/, "macOS"],
    [/CrOS/, "ChromeOS"],
    [/Linux/, "Linux"],
];

/** z.B. "Center · Chrome auf Android"; null, wenn nichts erkannt wird (die API vergibt dann "Center (Name)"). */
export async function automatischerGeraetName(): Promise<string | null> {
    const ua = (await headers()).get("user-agent") ?? "";
    const browser = BROWSER.find(([muster]) => muster.test(ua))?.[1];
    const system = SYSTEM.find(([muster]) => muster.test(ua))?.[1];
    if (!browser && !system) return null;
    return `Center · ${[browser, system].filter(Boolean).join(" auf ")}`;
}
