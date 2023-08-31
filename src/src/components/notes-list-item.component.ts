import { NoteData } from "../models/models";
import { htmlToDocumentFragment } from "../helpers/dom-helpers";

export class NotesListItemComponent {
    private data: NoteData;
    
    private listItemClass: string;
    private listElementName: string;
    private getDate: (data: NoteData) => string;
    private removeDataActionFactory: (data: NoteData) => (e: Event) => void;
    private onItemClickActionFactory: (data: NoteData) => () => void;

    constructor(
        data: NoteData, 
        listElementName: string, 
        listItemClass: string, 
        getDate: (data: NoteData) => string,
        removeDataActionFactory: (data: NoteData) => (e: Event) => void,
        onItemClickActionFactory: (data: NoteData) => () => void) {
        this.data = data;
        this.listItemClass = listItemClass;
        this.listElementName = listElementName;
        this.getDate = getDate;
        this.removeDataActionFactory = removeDataActionFactory;
        this.onItemClickActionFactory = onItemClickActionFactory;
    }

    public async render() {
        const html = this.getHtml();
        const thisComponentDocumentFragment = htmlToDocumentFragment(html)
        if(thisComponentDocumentFragment !== null){
            this.setupComponent(thisComponentDocumentFragment);
        }
        return thisComponentDocumentFragment.firstChild;
    }

    private setupComponent(content: DocumentFragment) {
        const deleteButton = content.querySelector(".remove");
        if(deleteButton === null) {
            return;
        }

        deleteButton.addEventListener("click", this.removeDataActionFactory(this.data)); 

        const listItem = content.querySelector(`.list-element`);
        if(listItem === null) {
            return;
        }

        listItem.addEventListener("click", this.onItemClickActionFactory(this.data));
            
    }

    public getHtml() {
        return (
            `
            <li id="id_${this.data.id!}" class=${this.listItemClass}>
                <div>
                    <button class="remove">x</button>
                    <span class="list-element">${this.listElementName}</span>
                </div>
                <div>${this.getDate(this.data)}</div>
            </li>`
        );
    }
}