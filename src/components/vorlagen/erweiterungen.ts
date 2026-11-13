import { type JSONContent, mergeAttributes, Node } from "@tiptap/react";

// Deutsche Beschriftung je Schlüssel, damit im Editor "Kundenname" statt "kunde_name" steht
type MarkenOptionen = {
    bezeichnungen: Record<string, string>;
};

// Platzhalter im Text, z.B. der Kundenname. Lässt sich nur als Ganzes verschieben oder löschen.
// Gespeichert als <span data-platzhalter="kunde_name">, die API setzt beim Versand den Wert ein.
export const PlatzhalterMarke = Node.create<MarkenOptionen>({
    name: "platzhalter",
    group: "inline",
    inline: true,
    atom: true,
    selectable: true,

    addOptions() {
        return { bezeichnungen: {} };
    },

    addAttributes() {
        return {
            name: {
                default: "",
                parseHTML: (element) => element.getAttribute("data-platzhalter") ?? "",
                renderHTML: (attribute) => ({ "data-platzhalter": attribute.name }),
            },
        };
    },

    parseHTML() {
        return [{ tag: "span[data-platzhalter]" }];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                class: "rounded bg-sky-100 px-1.5 py-0.5 font-medium whitespace-nowrap text-sky-900",
                title: "Platzhalter: wird beim Versand durch den echten Wert ersetzt",
            }),
            this.options.bezeichnungen[node.attrs.name] ?? node.attrs.name,
        ];
    },
});

// Fertiger Block, z.B. die Preistabelle. Das Aussehen legt die API fest.
// Gespeichert als <div data-baustein="preistabelle">.
export const BausteinMarke = Node.create<MarkenOptionen>({
    name: "baustein",
    group: "block",
    atom: true,
    selectable: true,
    draggable: true,

    addOptions() {
        return { bezeichnungen: {} };
    },

    addAttributes() {
        return {
            name: {
                default: "",
                parseHTML: (element) => element.getAttribute("data-baustein") ?? "",
                renderHTML: (attribute) => ({ "data-baustein": attribute.name }),
            },
        };
    },

    parseHTML() {
        return [{ tag: "div[data-baustein]" }];
    },

    renderHTML({ node, HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, {
                class: "my-3 rounded-md border border-dashed border-amber-400 bg-amber-50 px-3 py-4 text-center font-medium text-amber-900",
                title: "Baustein: wird beim Versand durch die fertige Tabelle ersetzt",
            }),
            `Baustein: ${this.options.bezeichnungen[node.attrs.name] ?? node.attrs.name}`,
        ];
    },
});

// Dokument mit genau einer Zeile, für den Betreff
export const EinzeilenDokument = Node.create({
    name: "doc",
    topNode: true,
    content: "paragraph",
});

const PLATZHALTER_IM_TEXT = /\{\{\s*([^{}]*?)\s*\}\}/g;

// "Deine Quittung {{quittung_nummer}}" -> Inhalt für den einzeiligen Editor
export function betreffZuInhalt(betreff: string): JSONContent {
    const teile: JSONContent[] = [];
    let ende = 0;
    for (const treffer of betreff.matchAll(PLATZHALTER_IM_TEXT)) {
        if (treffer.index > ende) teile.push({ type: "text", text: betreff.slice(ende, treffer.index) });
        teile.push({ type: "platzhalter", attrs: { name: treffer[1] } });
        ende = treffer.index + treffer[0].length;
    }
    if (ende < betreff.length) teile.push({ type: "text", text: betreff.slice(ende) });
    return { type: "doc", content: [{ type: "paragraph", content: teile }] };
}

// Inhalt des einzeiligen Editors -> "Deine Quittung {{quittung_nummer}}"
export function inhaltZuBetreff(inhalt: JSONContent): string {
    if (inhalt.type === "text") return inhalt.text ?? "";
    if (inhalt.type === "platzhalter") return `{{${inhalt.attrs?.name ?? ""}}}`;
    return (inhalt.content ?? []).map(inhaltZuBetreff).join("");
}
