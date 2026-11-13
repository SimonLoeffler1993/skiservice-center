"use client";

import { useState } from "react";
import { type Editor, EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Italic, Link2, List, ListOrdered, Redo2, Table, Undo2, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Baustein, Platzhalter } from "@/types/mailvorlagentypes";
import { BausteinMarke, betreffZuInhalt, EinzeilenDokument, inhaltZuBetreff, PlatzhalterMarke } from "./erweiterungen";

type TextEditorProps = {
    // Anfangswert: HTML, bei einzeilig der Betreff mit {{platzhalter}}. Spätere Änderungen der Prop werden nicht übernommen
    wert: string;
    // Nur eine Zeile ohne Formatierung (Betreff)
    einzeilig?: boolean;
    platzhalter: Platzhalter[];
    bausteine?: Baustein[];
    // Wert, wie ihn der Editor nach dem Laden ausgibt: Vergleichsbasis für "geändert"
    onBereit: (wert: string) => void;
    onChange: (wert: string) => void;
    beschriftung: string;
}

function ausgabe(editor: Editor, einzeilig: boolean): string {
    return einzeilig ? inhaltZuBetreff(editor.getJSON()) : editor.getHTML();
}

// Aussehen des Textes im Editor, angelehnt an die fertige Mail
const TEXT_KLASSEN = "text-sm leading-relaxed outline-none [&_a]:text-blue-700 [&_a]:underline [&_h2]:mb-4 [&_h2]:text-base [&_h2]:font-bold "
    + "[&_h3]:mb-3 [&_h3]:font-bold [&_li_p]:mb-0 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 "
    + "[&_.ProseMirror-selectednode]:ring-2 [&_.ProseMirror-selectednode]:ring-ring";

export default function TextEditor({ wert, einzeilig = false, platzhalter, bausteine = [], onBereit, onChange, beschriftung }: TextEditorProps) {
    const editor = useEditor({
        // Next.js rendert auf dem Server vor, der Editor entsteht erst im Browser
        immediatelyRender: false,
        extensions: [
            einzeilig
                ? StarterKit.configure({
                    document: false, blockquote: false, bold: false, bulletList: false, code: false, codeBlock: false, hardBreak: false,
                    heading: false, horizontalRule: false, italic: false, link: false, listItem: false, listKeymap: false,
                    orderedList: false, strike: false, trailingNode: false, underline: false,
                })
                : StarterKit.configure({
                    blockquote: false, code: false, codeBlock: false, horizontalRule: false, strike: false,
                    heading: { levels: [2, 3] },
                    link: { openOnClick: false, protocols: ["mailto", "tel"] },
                }),
            ...(einzeilig ? [EinzeilenDokument] : []),
            PlatzhalterMarke.configure({ bezeichnungen: Object.fromEntries(platzhalter.map((p) => [p.schluessel, p.bezeichnung])) }),
            ...(einzeilig ? [] : [BausteinMarke.configure({ bezeichnungen: Object.fromEntries(bausteine.map((b) => [b.schluessel, b.bezeichnung])) })]),
        ],
        content: einzeilig ? betreffZuInhalt(wert) : wert,
        editorProps: {
            attributes: {
                class: cn(TEXT_KLASSEN, einzeilig ? "px-3 py-2 [&_p]:mb-0" : "min-h-72 p-4"),
                "aria-label": beschriftung,
            },
            // Im Betreff gibt es keine zweite Zeile
            handleKeyDown: (_, ereignis) => einzeilig && ereignis.key === "Enter",
        },
        onCreate: ({ editor }) => onBereit(ausgabe(editor, einzeilig)),
        onUpdate: ({ editor }) => onChange(ausgabe(editor, einzeilig)),
    });

    if (!editor) {
        return <div className={cn("rounded-md border bg-muted/30", einzeilig ? "h-10" : "h-80")} />;
    }

    return (
        <div className="rounded-md border bg-background focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
            {einzeilig ? (
                <div className="flex items-center gap-2 pr-1.5">
                    <EditorContent editor={editor} className="min-w-0 flex-1" />
                    <PlatzhalterMenue editor={editor} platzhalter={platzhalter} klein />
                </div>
            ) : (
                <>
                    <Werkzeugleiste editor={editor} platzhalter={platzhalter} bausteine={bausteine} />
                    <EditorContent editor={editor} />
                </>
            )}
        </div>
    );
}

function Werkzeugleiste({ editor, platzhalter, bausteine }: { editor: Editor; platzhalter: Platzhalter[]; bausteine: Baustein[] }) {
    // Der Editor rendert nicht bei jeder Eingabe neu, der Zustand der Knöpfe wird gezielt abgefragt
    const zustand = useEditorState({
        editor,
        selector: ({ editor }) => ({
            fett: editor.isActive("bold"),
            kursiv: editor.isActive("italic"),
            ueberschrift: editor.isActive("heading", { level: 2 }),
            liste: editor.isActive("bulletList"),
            nummeriert: editor.isActive("orderedList"),
            link: editor.isActive("link"),
            rueckgaengig: editor.can().undo(),
            wiederholen: editor.can().redo(),
        }),
    });

    return (
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1.5">
            <Knopf aktiv={zustand.fett} onClick={() => editor.chain().focus().toggleBold().run()}><Bold />Fett</Knopf>
            <Knopf aktiv={zustand.kursiv} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic />Kursiv</Knopf>
            <Knopf aktiv={zustand.ueberschrift} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 />Überschrift</Knopf>
            <Knopf aktiv={zustand.liste} onClick={() => editor.chain().focus().toggleBulletList().run()}><List />Liste</Knopf>
            <Knopf aktiv={zustand.nummeriert} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered />Nummeriert</Knopf>
            <LinkKnopf editor={editor} aktiv={zustand.link} />
            <Knopf deaktiviert={!zustand.rueckgaengig} onClick={() => editor.chain().focus().undo().run()} titel="Rückgängig"><Undo2 /></Knopf>
            <Knopf deaktiviert={!zustand.wiederholen} onClick={() => editor.chain().focus().redo().run()} titel="Wiederholen"><Redo2 /></Knopf>
            <div className="ml-auto flex flex-wrap gap-1">
                <PlatzhalterMenue editor={editor} platzhalter={platzhalter} />
                {bausteine.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline" size="sm"><Table />Baustein einfügen</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="max-w-xs" onCloseAutoFocus={(e) => { e.preventDefault(); editor.commands.focus(); }}>
                            <DropdownMenuLabel>Fertige Tabelle an der Schreibmarke einfügen</DropdownMenuLabel>
                            {bausteine.map((baustein) => (
                                <DropdownMenuItem
                                    key={baustein.schluessel}
                                    className="flex-col items-start gap-0"
                                    onSelect={() => editor.chain().insertContent({ type: "baustein", attrs: { name: baustein.schluessel } }).run()}
                                >
                                    <span className="font-medium">{baustein.bezeichnung}</span>
                                    <span className="text-xs text-muted-foreground">{baustein.beschreibung}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}

function Knopf({ aktiv, deaktiviert, onClick, titel, children }: {
    aktiv?: boolean; deaktiviert?: boolean; onClick: () => void; titel?: string; children: React.ReactNode;
}) {
    return (
        <Button
            type="button"
            variant={aktiv ? "secondary" : "ghost"}
            size="sm"
            className={cn(aktiv && "ring-1 ring-border")}
            aria-pressed={aktiv}
            aria-label={titel}
            title={titel}
            disabled={deaktiviert}
            // Die Markierung im Text soll beim Klick erhalten bleiben
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
        >
            {children}
        </Button>
    );
}

// Nach dem Schließen geht der Fokus zurück in den Text (statt auf den Knopf), damit man gleich weiterschreiben kann
function PlatzhalterMenue({ editor, platzhalter, klein }: { editor: Editor; platzhalter: Platzhalter[]; klein?: boolean }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant={klein ? "ghost" : "outline"} size="sm"><UserRound />{klein ? "Platzhalter" : "Platzhalter einfügen"}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onCloseAutoFocus={(e) => { e.preventDefault(); editor.commands.focus(); }}>
                <DropdownMenuLabel>Wird beim Versand ersetzt, z.B. durch</DropdownMenuLabel>
                {platzhalter.map((eintrag) => (
                    <DropdownMenuItem
                        key={eintrag.schluessel}
                        className="justify-between gap-6"
                        onSelect={() => editor.chain().insertContent({ type: "platzhalter", attrs: { name: eintrag.schluessel } }).run()}
                    >
                        <span className="font-medium">{eintrag.bezeichnung}</span>
                        <span className="text-xs text-muted-foreground">{eintrag.beispiel}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function LinkKnopf({ editor, aktiv }: { editor: Editor; aktiv: boolean }) {
    const [offen, setOffen] = useState(false);
    const [adresse, setAdresse] = useState("");

    function oeffnen(neu: boolean) {
        if (neu) setAdresse(editor.getAttributes("link").href ?? "");
        setOffen(neu);
    }

    function uebernehmen() {
        const ziel = adresse.trim();
        if (!ziel) {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            // Ohne Angabe ist eine Internetadresse gemeint
            const href = /^(https?:|mailto:|tel:)/i.test(ziel) ? ziel : `https://${ziel}`;
            editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
        }
        setOffen(false);
    }

    return (
        <Popover open={offen} onOpenChange={oeffnen}>
            <PopoverTrigger asChild>
                <Button type="button" variant={aktiv ? "secondary" : "ghost"} size="sm" className={cn(aktiv && "ring-1 ring-border")}><Link2 />Link</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 space-y-2" onCloseAutoFocus={(e) => { e.preventDefault(); editor.commands.focus(); }}>
                <p className="text-sm text-muted-foreground">Erst den Text markieren, dann hier die Adresse eintragen.</p>
                <Input
                    autoFocus
                    placeholder="www.beispiel.de"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); uebernehmen(); } }}
                />
                <div className="flex justify-end gap-2">
                    {aktiv && (
                        <Button type="button" variant="outline" size="sm" onClick={() => { editor.chain().focus().extendMarkRange("link").unsetLink().run(); setOffen(false); }}>
                            Link entfernen
                        </Button>
                    )}
                    <Button type="button" size="sm" onClick={uebernehmen}>Übernehmen</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
