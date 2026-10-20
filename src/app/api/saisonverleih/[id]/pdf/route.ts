import { config } from "@/lib/config";

// Reicht das Verleih-PDF der API an den Browser durch.
// "inline" sorgt dafür, dass der Browser das PDF anzeigt statt es herunterzuladen.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
        return new Response("Ungültige ID", { status: 400 });
    }

    try {
        const response = await fetch(`${config.backendUrl}/api/v1/saisonverleih/pdf/${id}`, { cache: "no-store" });
        if (!response.ok) {
            return new Response("PDF konnte nicht erstellt werden", { status: response.status });
        }
        return new Response(response.body, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `inline; filename="saisonverleih-${id}.pdf"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Backend nicht erreichbar:", error);
        return new Response("Backend nicht erreichbar", { status: 502 });
    }
}
