type SaisonverleihAnzeigenProps = {
    params: {
        id: string;
    };
}

export default function SaisonverleihAnzeigen({params}: SaisonverleihAnzeigenProps) {
    
    return (
        <div>
            <h1>Saisonverleih Anzeigen {params.id}</h1>
        </div>
    );
}