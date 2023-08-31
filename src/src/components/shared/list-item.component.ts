import { htmlToChildNode, htmlToDocumentFragment } from "../../helpers/dom-helpers";
import NamedData, { IComponent } from "../../models/models";

export class CustomListItemComponent implements IComponent {
    private data: NamedData;
    private listItemClass: string;
    private listElementName: string;
    private getDate: (data: NamedData) => string;
    private removeDataActionFactory: (dataId: string) => (e: Event) => void;
    private onItemClickActionFactory: (dataId : string) => () => void;
    private isTaskCompleted?: boolean;

    constructor(
        data: NamedData, 
        listElementName: string, 
        listItemClass: string, 
        getDate: (data: NamedData) => string,
        removeDataActionFactory: (dataId: string) => (e: Event) => void,
        onItemClickActionFactory: (dataId : string) => () => void,
        isTaskCompleted? : boolean) {
            this.data = data;
            this.listItemClass = listItemClass;
            this.listElementName = listElementName;
            this.getDate = getDate;
            this.removeDataActionFactory = removeDataActionFactory;
            this.onItemClickActionFactory = onItemClickActionFactory;
            this.isTaskCompleted = isTaskCompleted;
    }

    public async render() {
        const html = this.getHtml();
        const thisComponentChildNode = htmlToChildNode(html) as HTMLDivElement;

        this.setupComponent(thisComponentChildNode);

        return thisComponentChildNode;
    }

    private setupComponent(content: HTMLDivElement) {
        if(this.isTaskCompleted !== true) {
            const deleteButton = document.createElement("img");
            deleteButton.className = "remove";
            deleteButton.src = "src/images/icons8-remove-50.png"
            deleteButton.addEventListener("click", this.removeDataActionFactory(this.data.id!)); 
            content.append(deleteButton);
        } else {
            content.style.justifyContent = "flex-start";
            const dateItem = content.querySelector(".date-item") as HTMLDivElement;
            dateItem!.style.flexGrow = "1";
        }

        const listItem = content.querySelector(`.list-element`);
        if(listItem === null) {
            return;
        }

        listItem.addEventListener("click", this.onItemClickActionFactory(this.data.id!));
    }

    public getHtml() {
        return (
            `
            <li id="id_${this.data.id!}" class=${this.listItemClass}>
                <div class="list-element"><span class="list-element-category">${this.listItemClass === "task" ? "Task" : "Note"}:</span><span class="list-element-name">${this.listElementName}<span></div>
                <div class="date-item"><span class="date-category">${this.listItemClass === "task" ? "Deadline:" : "Date created:"}</span><br/>${this.getDate(this.data)}</div>
            </li>`
        );
    }
}