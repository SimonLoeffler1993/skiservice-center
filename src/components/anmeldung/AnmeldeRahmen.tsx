import { Snowflake } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Zentrierte Karte für Anmeldung, Bedienerauswahl und Einrichtung. */
export default function AnmeldeRahmen({ titel, beschreibung, children }: {
    titel: string;
    beschreibung?: string;
    children: React.ReactNode;
}) {
    return (
        <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Snowflake className="mx-auto size-8 text-muted-foreground" />
                    <CardTitle className="text-xl">{titel}</CardTitle>
                    {beschreibung && <CardDescription>{beschreibung}</CardDescription>}
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </main>
    );
}
