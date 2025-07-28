"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Kunde } from "@/types/skikundentypes";
import { User, Mail, Phone, MapPin, Hash, X } from "lucide-react";

type KundeFormProps = {
    kunde: Kunde;
    onClose?: () => void;
};

export default function KundeForm({ kunde, onClose }: KundeFormProps) {
    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Kundendetails
                </CardTitle>
                {onClose && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Persönliche Informationen */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                            <Hash className="h-3 w-3 mr-1" />
                            ID: {kunde.ID}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Vorname
                            </label>
                            <p className="text-base font-medium">{kunde.Vorname}</p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Nachname
                            </label>
                            <p className="text-base font-medium">{kunde.Nachname}</p>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-border" />

                {/* Adresse */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Adresse
                    </h3>
                    
                    <div className="space-y-2">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Straße
                            </label>
                            <p className="text-base">{kunde.Strasse}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Postleitzahl
                                </label>
                                <p className="text-base">{kunde.Ort.Postlz}</p>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Ort
                                </label>
                                <p className="text-base">{kunde.Ort.Ort}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-t border-border" />

                {/* Kontaktinformationen */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Kontakt</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                Telefon
                            </label>
                            <p className="text-base">
                                {kunde.Tel || (
                                    <span className="text-muted-foreground italic">Nicht angegeben</span>
                                )}
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                E-Mail
                            </label>
                            <p className="text-base">
                                {kunde.Email ? (
                                    <a 
                                        href={`mailto:${kunde.Email}`} 
                                        className="text-blue-600 hover:underline"
                                    >
                                        {kunde.Email}
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground italic">Nicht angegeben</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vollständige Adresse als Zusammenfassung */}
                <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Vollständige Adresse</h4>
                    <p className="text-sm">
                        {kunde.Vorname} {kunde.Nachname}<br />
                        {kunde.Strasse}<br />
                        {kunde.Ort.Postlz} {kunde.Ort.Ort}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}