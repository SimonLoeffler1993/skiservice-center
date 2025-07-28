import { Card, CardDescription, CardTitle, CardContent } from "../ui/card";


type KachelProps = {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function Kachel({ title, description, children }: KachelProps) {

return (
    <>
    <Card>
        <CardContent>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            <div className="flex flex-col gap-2">
                {children}
            </div>
        </CardContent>
    </Card>
    </>
)
}