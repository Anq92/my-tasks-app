import { NoteData, IComponent } from "../models/models";
import { NotesListItemComponent } from "./notes-list-item.component";

export class NotesListComponent implements IComponent {
    private data: NoteData[];
    private listItemClass: string;
    private listId: string;
    private getDate: (data: NoteData) => string;
    private removeDataActionFactory: (data: NoteData) => (e: Event) => void;
    private onItemClickActionFactory: (data: NoteData) => () => void;

    constructor(
        data: NoteData[], 
        listItemClass: string, 
        listId: string, 
        getDate: (data: NoteData) => string,
        removeDataActionFactory: (data: NoteData) => (e: Event) => void,
        onItemClickActionFactory: (data: NoteData) => () => void) {
        this.data = data;
        this.listItemClass = listItemClass;
        this.listId = listId;
        this.getDate = getDate;
        this.removeDataActionFactory = removeDataActionFactory;
        this.onItemClickActionFactory = onItemClickActionFactory;
    }
    
    private generateListItems() {
        if (this.data.length === 0) {
            return null;
        } else {
            return Promise.all(
                this.data
                .filter(d=> d.id !== undefined && d.id !== null)
                .map(async el => {
                    const itemComponent = new NotesListItemComponent(
                        el, 
                        el.name, 
                        this.listItemClass,
                        this.getDate,
                        this.removeDataActionFactory,
                        this.onItemClickActionFactory);
                    return (await itemComponent.render())!;
                }));
        }

    }

    public async render() {
        let items = await this.generateListItems();
        if (items === null) {
            return items;
        } else  {
            const listDiv = document.createElement("div");
            listDiv.id = this.listId;
            const list = document.createElement("ul");
            list.className = "list";
            items.forEach(element => {
                list.append(element);
            });
            listDiv.append(list);
            return listDiv;
        }

    }
}