import { config } from "@/lib/config";

// Reicht das Quittungs-PDF der API an den Browser durch (bei externen Quittungen das PDF aus Lexware).
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
        return new Response("Ungültige ID", { status: 400 });
    }

    try {
        const response = await fetch(`${config.backendUrl}/api/v1/quittungen/quittung/${id}/pdf`, { cache: "no-store" });
        if (!response.ok) {
            const fehler = await response.json().catch(() => null);
            return new Response(fehler?.detail ?? "PDF konnte nicht erstellt werden", { status: response.status });
        }
        // Dateiname der API übernehmen (z.B. RE1001.pdf aus Lexware)
        const disposition = response.headers.get("content-disposition") ?? `inline; filename="quittung-${id}.pdf"`;
        return new Response(response.body, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": disposition.replace(/^attachment/, "inline"),
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return new Response("Backend nicht erreichbar", { status: 502 });
    }
}
