import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSaisonverleihContext } from "@/context/saisonverleih-context";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SaisonMaterialListeProps = {
    showAktionSpalte?: boolean;
}

export default function SaisonMaterialListe({ showAktionSpalte = true }: SaisonMaterialListeProps) {
    const { materialList, setMaterialList } = useSaisonverleihContext();
    
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
    // TODO: Zeilen Formatieren und Daten abrufen und für Details ansicht
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
                        {showAktionSpalte && <TableHead className="text-center">Aktion</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materialList.map((material, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-center">{material.Preis}</TableCell>
                            <TableCell className="text-center">{material.skinr}</TableCell>
                            <TableCell className="text-center">{material.schuhnr}</TableCell>
                            <TableCell className="text-center">{material.stockbez_ID}</TableCell>
                            <TableCell className="text-center">{material.SkiFahrerName}</TableCell>
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