export default async function SkiserviceAuftragAnzeigen({ params }: { params: Promise<{ id: string }> }){
    const { id } = await params;
    return(
        <h1>Auftrag {id} wird angezeigt</h1>
    )
}