import { dateToHtmlDateInput, dateToHtmlTimeInput, htmlInputToDate } from "../helpers/time-format-converters";
import { TaskData } from "../models/models";
import { createNameInputArea } from "./shared/name-input.component";
import { viewAlertBox } from "./shared/alert-box.components";

export class TaskDetailsFormComponent {              
    private updateTaskData : () => (taskData: TaskData) => void;
    private taskData: TaskData;
    private allTasks: TaskData[];

    constructor(taskData: TaskData, allTasks: TaskData[], updateTaskData: () => (taskData: TaskData) => void) {
        this.allTasks = allTasks;
        this.taskData = taskData;
        this.updateTaskData = updateTaskData;

    }

    public render() {
        const form = document.createElement("div")
        form.innerHTML = this.getHtml();
        this.setupForm(form);
        return form;
    }

    private setupForm(form: HTMLDivElement) {

        if(this.taskData.isCompleted) {
            this.disableInputs(form);
        }
        this.isCompletedChecked(form);
        const update = this.updateTaskData();
        const nameTextArea : HTMLElement | undefined = createNameInputArea(this.taskData.name, this.taskData.isCompleted);
        const date = form.querySelector("#date") as HTMLInputElement;
        const time = form.querySelector("#time") as HTMLInputElement;
        const oldDateInputValue = date.value;
        const oldTimeInputValue = time.value;

        date.addEventListener("blur", () => {
            if(oldDateInputValue !== date.value) {
                const newDate = new Date(htmlInputToDate(date.value, time.value));
                const currentDate = new Date();
                if (newDate > currentDate) {
                    this.taskData.dueDate = htmlInputToDate(date.value, time.value);
                    update(this.taskData);
                } else {
                    viewAlertBox("This is a past date, please enter a correct date.");
                    date.value = dateToHtmlDateInput(this.taskData.dueDate) as string;
                }

            }
        });

        time.addEventListener("blur", () => {
            if(oldTimeInputValue !== time.value) {
                const newDate = new Date(htmlInputToDate(date.value, time.value));
                const currentDate = new Date();

                if (newDate > currentDate) {
                    this.taskData.dueDate = htmlInputToDate(date.value, time.value);
                    update(this.taskData);
                } else {
                    viewAlertBox("This is a past date, please enter a correct date.");
                    time.value = dateToHtmlTimeInput(this.taskData.dueDate) as string;
                }
            }
        });

        form.prepend(nameTextArea!);
        form.addEventListener("change", (e) => {

            const currentInput = e.target as HTMLInputElement;
            if (currentInput.id === "date") {
                return;
            }
            if (currentInput.id === "time") {
                return;
            }

            const target = e.currentTarget as HTMLDivElement;
            const description = target.querySelector("#task-description") as HTMLTextAreaElement;
            const name = target.querySelector("#name-input") as HTMLInputElement;

            const isCompletedCheckbox = target.querySelector("#completed") as HTMLInputElement;
            const isCompleted : boolean = isCompletedCheckbox.checked ;

            this.taskData.description = description.value;
            this.taskData.isCompleted = isCompleted;
            this.taskData.dueDate = htmlInputToDate(date.value, time.value);;

            if (name) {
                const nameRepeated = this.allTasks.find(task => task.name === name.value && task.id !== this.taskData.id);
                if(nameRepeated) {
                    viewAlertBox(`There is already a task called <span class="name-alert-message">${name.value}</span>, please enter a different name.`);
                    name.value = this.taskData.name;
                    return;
                    
                } else {
                    this.taskData.name = name.value;
                }
            } else {
                this.taskData.name = this.taskData.name;
            }
            update(this.taskData);
        });
    }


    private isCompletedChecked(form: HTMLDivElement) {
        const completedCheckBox = form.querySelector("#completed") as HTMLInputElement;
        if (this.taskData.isCompleted) {
            completedCheckBox.checked = true;
        }
    }

    private disableInputs(form: HTMLDivElement) {
        const inputsToDisable = Array.from(form.querySelectorAll(".disable input, .disable textarea"));
        inputsToDisable.forEach((input) => {
            const currentInput = input as HTMLInputElement;
            currentInput.disabled = true;
        });
    }

    private getHtml() {
        const formString =
        `<form id="task-info">
            <hr>
            <div class="checkbox-container"><input type="checkbox" id="completed" value="completed" /><label id="label-completed" for="completed">Completed</label></div>
            <div id="deadline" class="disable"><div><label for="deadline time"><span class="tasks-label">Deadline</span></label></div><div><input type="date" id="date" class="deadline-input" value="${dateToHtmlDateInput(this.taskData.dueDate)}"/>
            <input type="time" id="time" class="deadline-input" value="${dateToHtmlTimeInput(this.taskData.dueDate)}"/></div></div>
            <div class="description disable"><textarea id="task-description" placeholder="Add description...">${this.taskData.description}</textarea></div>
        <form>`;
        return formString;
    }

}