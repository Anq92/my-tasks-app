import { DataWithDates } from "../models/models";

export function htmlToChildNode(html: string) : ChildNode | null {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

export function htmlToDocumentFragment(html: string) : DocumentFragment {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content;
}

export function htmlElementToDocumentFragment(htmlElement: HTMLElement) : DocumentFragment {
    const fragment = document.createDocumentFragment();
    fragment.append(htmlElement);
    return fragment;
}

