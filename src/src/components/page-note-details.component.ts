import { NoteData } from '../models/models'
import { NotesHttpService } from '../services/notes.service'
import { htmlElementToDocumentFragment } from '../helpers/dom-helpers';
import { dateToHtmlDateInput } from '../helpers/time-format-converters';
import { createNoteDetailsForm } from './note-details-form.component';
import { loadingMessage } from './shared/loading-message';
import { handleRequest } from '../services/handle-http-request';
import { INavigation
 } from '../models/models';

export class NoteDetailsComponent {
    private notesHttpService = new NotesHttpService();
    private id = "note-details";
    private note: NoteData;
    private notes: NoteData[];
    private taskId: string;
    private navigation: INavigation;
    private isTaskCompleted: boolean;
    
    constructor(navigation : INavigation, note: NoteData, notes: NoteData[], taskId: string, isTaskCompleted: boolean){
        this.navigation = navigation;
        this.note = note;
        this.notes = notes;
        this.taskId = taskId;
        this.isTaskCompleted = isTaskCompleted;
    }


    public render() {
        const html = this.getHtml();
        const thisComponentDocumentFragment = htmlElementToDocumentFragment(html);

        return thisComponentDocumentFragment.firstChild;
    }

    private getHtml() : HTMLDivElement {
        const noteData = this.note;
        const allNotes = this.notes;
        const notesHttpService = this.notesHttpService;
        const taskId = this.taskId;
        const localNavigation = this.navigation;

        const body = document.createElement("div");
        body.id = `${this.id}`;

        const form = createNoteDetailsForm(noteData, allNotes, onUpdateActionFactory, this.isTaskCompleted)

        const dateCreated = document.createElement("div");
        dateCreated.innerHTML = `Created on: ${dateToHtmlDateInput(this.note.createdOn)}`;

        body.append(form, dateCreated);

        function onUpdateActionFactory() {
            const currentNote = {} as NoteData;
            Object.assign(currentNote, noteData);
            const update = async (noteData: NoteData) => {
                loadingMessage("Saving data...");
                const request =  async () => { return notesHttpService.changeNoteData(noteData, taskId) };
                const response = await handleRequest(request);
                if(response) {
                    loadingMessage("Data saved!");
                    setTimeout( () => {localNavigation.displayNoteDetailsAsync(noteData)}, 1200);
                } else {
                    localNavigation.displayNoteDetailsAsync(currentNote);
                }
            }
            return update;
        }

        return body;
    }

}
