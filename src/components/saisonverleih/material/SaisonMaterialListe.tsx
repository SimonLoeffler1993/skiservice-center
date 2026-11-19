import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bindungsdatenText } from "@/types/bindungsdatentypes";
import { MaterialZeile, schuhText, skiText } from "@/types/materialtypes";
import { skiStoeckeOptions } from "@/hooks/useSchuhMaterialOptions";
import { useQuery } from "@tanstack/react-query";

type SaisonMaterialListeProps = {
    showAktionSpalte?: boolean;
}

// Nummer, darunter klein was es ist (Modell und Länge/Größe)
function Teil({ nummer, text }: { nummer?: string | number; text?: string }) {
    if (nummer === undefined || nummer === "") return <>–</>;
    return (
        <>
            <div>{nummer}</div>
            {text && <div className="text-xs text-muted-foreground">{text}</div>}
        </>
    );
}

export default function SaisonMaterialListe({ showAktionSpalte = true }: SaisonMaterialListeProps) {
    const { materialList, setMaterialList } = useSaisonverleihContext();
    // Bezeichnungen der Stöcke, durch die Stock-Auswahl schon geladen
    const { data: stoecke } = useQuery(skiStoeckeOptions);

    // Bezeichnung und Länge des Stocks, ohne Stock (-1 bzw. nichts gewählt) ein Strich
    function stockText(material: MaterialZeile): string {
        if (material.stockbez_ID <= 0) return "–";
        const stock = stoecke?.success ? stoecke.data.find((s) => s.ID === material.stockbez_ID) : undefined;
        const bezeichnung = stock?.Bezeichnung ?? `Stock ${material.stockbez_ID}`;
        return material.stocklaenge > 0 ? `${bezeichnung} · ${material.stocklaenge} cm` : bezeichnung;
    }

    
    const handleDelete = (index: number) => {
        const newList = [...materialList];
        newList.splice(index, 1);
        setMaterialList(newList);
    };

    if (materialList.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                Noch kein Material ausgewählt.
            </p>
        );
    }
    return (
        <div>
            <Table>
                <TableCaption>Ausgewähltes Material</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Preis</TableHead>
                        <TableHead className="text-center">Ski</TableHead>
                        <TableHead className="text-center">Schuh</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Skifahrer</TableHead>
                        <TableHead className="text-center">Bindung</TableHead>
                        {showAktionSpalte && <TableHead className="text-center">Aktion</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materialList.map((material, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-center">{material.Preis}</TableCell>
                            <TableCell className="text-center">
                                <Teil nummer={material.skinr} text={material.ski && skiText(material.ski)} />
                            </TableCell>
                            <TableCell className="text-center">
                                <Teil nummer={material.schuhAnzeige || material.schuhnr} text={material.schuh && schuhText(material.schuh)} />
                            </TableCell>
                            <TableCell className="text-center">{stockText(material)}</TableCell>
                            <TableCell className="text-center">{material.SkiFahrerName}</TableCell>
                            <TableCell className="text-center text-xs text-muted-foreground">{bindungsdatenText(material.bindungsdaten) ?? "–"}</TableCell>
                            {showAktionSpalte && (<TableCell className="text-center">
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDelete(index)}
                                    className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Löschen</span>
                                </Button>
                            </TableCell>)}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}