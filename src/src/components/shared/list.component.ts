import { CustomListItemComponent } from "./list-item.component";
import NamedData, { IComponent } from '../../models/models'

export class ListComponent implements IComponent {
    private emptyListText: string;
    private data: NamedData[];
    private listItemClass: string;
    private listId: string;
    private getDate: (data: NamedData) => string;
    private removeDataActionFactory: (dataId: string) => (e: Event) => void;
    private onItemClickActionFactory: (dataId : string) => () => void;
    private isTaskCompleted?: boolean;

    constructor(
        emptyListText: string,
        data: NamedData[], 
        listItemClass: string, 
        listId: string, 
        getDate: (data: NamedData) => string,
        removeDataActionFactory: (dataId: string) => (e: Event) => void,
        onItemClickActionFactory: (dataId : string) => () => void,
        isTaskCompleted? : boolean) {
            this.emptyListText = emptyListText;
            this.data = data;
            this.listItemClass = listItemClass;
            this.listId = listId;
            this.getDate = getDate;
            this.removeDataActionFactory = removeDataActionFactory;
            this.onItemClickActionFactory = onItemClickActionFactory;
            this.isTaskCompleted = isTaskCompleted;
    }
    
    private generateListItems() {
        if (this.data.length === 0) {
            return null;
        } else {
            return Promise.all(
                this.data
                .filter(d=> d.id !== undefined && d.id !== null)
                .map(async (el) => {
                    const itemComponent = new CustomListItemComponent(
                        el,
                        el.name, 
                        this.listItemClass,
                        this.getDate,
                        this.removeDataActionFactory,
                        this.onItemClickActionFactory,
                        this.isTaskCompleted);
                    return (await itemComponent.render())!;
                }));
        }
    }

    public async render() {
        const listDiv = document.createElement("div");
        listDiv.id = this.listId;
        let items = await this.generateListItems();
        if (items === null) {
            listDiv.innerHTML = this.emptyListText;
        } else  {

            const list = document.createElement("ul");
            list.className = "list";
            items.forEach(element => {
                list.append(element);
            });
            listDiv.append(list);
        }
        return listDiv;
    }
}
