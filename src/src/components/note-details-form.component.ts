import { NoteData } from "../models/models";
import { createNameInputArea } from "./shared/name-input.component";
import { viewAlertBox } from "./shared/alert-box.components";

export function createNoteDetailsForm(noteData: NoteData, allNotes: NoteData[], updateEvent: () => (noteData: NoteData) => void, isTaskCompleted: boolean) {
    const form = document.createElement("form");
    form.id = "note-content";

    const nameTextArea : HTMLElement | undefined = createNameInputArea(noteData.name, isTaskCompleted);

    const descriptionTextArea = document.createElement("textarea");
    descriptionTextArea.id = "note-description";
    descriptionTextArea.innerHTML = `${noteData.description}`;
    descriptionTextArea.placeholder= "Add description...";
    form.append(nameTextArea!, descriptionTextArea);

    const update = updateEvent();

    if (isTaskCompleted) {
        descriptionTextArea.disabled = true;
    }
    form.addEventListener("change", (e) => {
        const target = e.currentTarget as HTMLDivElement;
        noteData.description = descriptionTextArea.value;
        const name = target.querySelector("#name-input") as HTMLInputElement;

        if(name) {
            const nameRepeated = allNotes.find(note => note.name === name.value && note.id !== noteData.id);
            if(nameRepeated) {
                viewAlertBox(`There is already a note called <span class="name-alert-message">${name.value}</span>, please enter a different name.`);
                name.value = noteData.name;
                return;
            } else {
                noteData.name = name.value;
            }
        } else {
            noteData.name = noteData.name;
        }  

        update(noteData);

    });

    return form;
}