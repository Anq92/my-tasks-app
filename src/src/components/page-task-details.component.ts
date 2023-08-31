import NamedData, { GenericResponse, INavigation, NoteData, TaskData } from '../models/models'
import { NotesHttpService } from '../services/notes.service'
import { TasksHttpService } from '../services/tasks.service';
import { htmlElementToDocumentFragment } from '../helpers/dom-helpers';
import { uniqueName } from '../helpers/unique-name';
import { ListComponent } from './shared/list.component';
import { createNewListElementButton } from './add-list-element-button';
import { TaskDetailsFormComponent } from './task-details-form.component';
import { viewAlertBox } from './shared/alert-box.components';
import { loadingMessage } from './shared/loading-message';
import { handleRequest } from '../services/handle-http-request';
import { dateToHtmlDateInput } from '../helpers/time-format-converters';

function orderNotesByDate(notes: NoteData[]) {
    notes.sort(function(a,b) {
        const date1 : number = new Date(a.createdOn).valueOf();
        const date2 : number = new Date(b.createdOn).valueOf();
        const compare = date2-date1;
        return compare;
    })
}

async function createNewNote(id: string, notes: NoteData[], newNote: NoteData) {

    newNote.id = id;
    notes.push(newNote);
}

function getDate(data: NamedData) : string {
    const noteData : NoteData = data as NoteData;
    const date = dateToHtmlDateInput(noteData.createdOn);
    return date!;
};

export class TaskDetailsComponent {
    private navigation: INavigation;
    private notesHttpService = new NotesHttpService();
    private tasksHttpService = new TasksHttpService();
    private class = "content";
    private id = "task-details";
    private listName = "notes-list";
    private tasks: TaskData[];
    private noteListItemClass = "note";
    private taskData: TaskData;

    public notes :  NoteData[] = [];

    constructor(navigation : INavigation, taskData: TaskData, tasks: TaskData[]){
        this.tasks = tasks;
        this.taskData = taskData;
        this.navigation = navigation;
    }

    public async fetchData() : Promise<false | NoteData[]> {
        const request = async () => { return this.notesHttpService.getNotes(this.taskData.id as string)};
        const response = await handleRequest(request);

        if(response) {
            this.notes = response.data as NoteData[];
            return this.notes;
        } else {
            return false;
        }

    }

    public setData(notes: NoteData[]) {
        this.notes = notes;
        orderNotesByDate(this.notes);
    }
    
    public async render(){
        const html = await this.getHtmlElement();
        const thisComponentDocumentFragment = htmlElementToDocumentFragment(html)

        return thisComponentDocumentFragment.firstChild;
    }

    private async getHtmlElement() : Promise<HTMLElement> {
        const outerBody = document.createElement("div");
        outerBody.id = this.id;
        const innerBody = await this.getInnerHtml();
        outerBody.append(innerBody);
        return outerBody;
    }

    private async getInnerHtml() {
        const allTasks = this.tasks;
        const currentNotes = this.notes;
        const tasksHttpService = this.tasksHttpService;
        const notesHttpService = this.notesHttpService;
        const currentTaskData = this.taskData;
        const localNavigation = this.navigation;
        const taskId = this.taskData.id;
        const emptyListText = "Create your first note..."

        const body = document.createElement("div");
        body.id = `${this.id}_inner`;
        body.classList.add(`${this.class}`);


        const form = new TaskDetailsFormComponent(currentTaskData, allTasks, onUpdateActionFactory).render();

        function onItemClickActionFactory(dataId : string) {
            const eventHandler = () => {
                const currentNote = currentNotes.find(n => dataId === n.id);
                localNavigation.displayNoteDetailsAsync(currentNote!);
            }
            
            return eventHandler;
        }

        function onRemoveActionFactory(
                 dataId: string) {

            const eventHandler = async (e: Event) => {
                e.stopPropagation();
                viewAlertBox("Are you sure?", onConfirmAction, true);
            }
            
            const onConfirmAction = async () => {
                loadingMessage("Loading...");
                const request = async () => { return notesHttpService.deleteNote(dataId, taskId!) };
                const response = await handleRequest(request);
                if(response) {
                    deleteNote(currentNotes, dataId);
                }
                localNavigation.displayTaskDetailsAsync(currentTaskData, false);
            }
            return eventHandler;
        }

        function deleteNote(notes: NoteData[], noteId: string) {

            const currentNotes = notes.filter(n => n.id !== noteId);
            notes.splice(0, notes.length, ...currentNotes);

        }

        function newNoteButtonClickActionFactory() {
            const eventHandler = async (e : Event) => {
                const newNote : NoteData = {
                    taskId: taskId as string,
                    name: uniqueName("New note", currentNotes),
                    description: "",
                    createdOn: new Date().toISOString()
                }
                const message = "Loading...";
                loadingMessage(message);
                const request = async () => {return notesHttpService.addNewNote(newNote, taskId as string)};
                const response = await handleRequest(request) as GenericResponse<NamedData[]>;

                if(response) {
                    createNewNote(response.data[0].id!, currentNotes, newNote);
                }

                await localNavigation.displayTaskDetailsAsync(currentTaskData, false);
            };
            
            return eventHandler;
        }

        function onUpdateActionFactory() {
            const currentTasks = {} as TaskData;
            Object.assign(currentTasks, currentTaskData);
    
            const update = async (taskData: TaskData) => {

                loadingMessage("Saving data...");
                const request =  async () => { return tasksHttpService.changeTaskData(taskData, taskData.id!) };
                const response = await handleRequest(request);
                if(response) {
                    loadingMessage("Data saved!");
                    setTimeout( () => {localNavigation.displayTaskDetailsAsync(currentTaskData, false)}, 1200);
                } else {
                    localNavigation.displayTaskDetailsAsync(currentTasks, false);
                }
            }
    
            return update;
        }
        const notesListComponent = new ListComponent(
            emptyListText,
            this.notes, 
            this.noteListItemClass, 
            this.listName,
            getDate,
            onRemoveActionFactory,
            onItemClickActionFactory,
            currentTaskData.isCompleted);
        
        const notesList = await notesListComponent.render();

        const notesListHeader = document.createElement("h2");
        notesListHeader.innerHTML = "Notes: ";
        notesListHeader.className = "notes-header";

        const addButtonOnClick = newNoteButtonClickActionFactory();
        const newNoteButton = createNewListElementButton(addButtonOnClick)
        body.append(form, notesListHeader, notesList);
        if(!currentTaskData.isCompleted) {
            body.append(newNoteButton);
        }
        return body;
    }


}