"use client";

import { useRouter } from "next/navigation";
import { Card, CardDescription, CardTitle, CardContent } from "../ui/card";
import { Button } from "@/components/ui/button";

type KachelProps = {
    title: string;
    description: string;
    href: string;
    buttonText: string;
}

export default function Kachel({ title, description, href, buttonText }: KachelProps) {
    const router = useRouter();

    return (
        <Card>
            <CardContent>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <div className="flex flex-col gap-2">
                    <Button onClick={() => router.push(href)}>{buttonText}</Button>
                </div>
            </CardContent>
        </Card>
    );
}