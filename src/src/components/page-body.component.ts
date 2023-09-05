import { createSignOutButtonHtmlElement } from "./sign-in/sign-out-button.component";
import { TaskListComponent } from "./page-task-list.component";
import { TaskDetailsComponent } from "./page-task-details.component";
import { NoteDetailsComponent } from "./page-note-details.component";
import { INavigation, TaskData, NoteData } from "../models/models";
import { createBackButton } from "./shared/back-button.component";
import { Constants } from "../models/consts";

const localData : {
    tasks: TaskData[];
    taskId?: string;
    notes: NoteData[];
    noteId?: string;
    onReturn?: ((() => void )| null);
    tabId?: string;
} = {
    tasks : [],
    notes: [],
};


async function backButtonOnClickEvent() {

 localData.onReturn && localData.onReturn(); 

}

const navigation : INavigation = {
    displayTaskListAsync: async (refresh: boolean, tabId: string): Promise<void> => await Promise.resolve(),
    displayTaskDetailsAsync: async (taskData: TaskData, refresh: boolean): Promise<void> => await Promise.resolve(),
    displayNoteDetailsAsync: async (noteId: NoteData): Promise<void> => await Promise.resolve(),
};

export function createMainBody(innerHtml: string, onSignOut: (id: string) => Promise<void>) {
    
    const divElementFrame = document.createElement("div");
    const navButtonsContainer = document.createElement("div");
    const backButton = createBackButton(backButtonOnClickEvent);
    const usernameContainer = document.createElement("div");
    const navButtonsRightInnerContainer = document.createElement("div");
    const signOutButton = createSignOutButtonHtmlElement("sign-out", onSignOut);
    const divElementBody = document.createElement('div');
    const username = localStorage.getItem(Constants.Username);
    divElementFrame.id = "page-frame-component";
    divElementFrame.className = "container";

    navButtonsContainer.id = "nav-buttons";
    usernameContainer.id = "username-container";
    navButtonsRightInnerContainer.id = "nav-right-container"
    divElementBody.id = "main-body-component";

    if(username !== null) {
        usernameContainer.innerHTML = username;
    }

    navButtonsRightInnerContainer.append(usernameContainer, signOutButton);
    navButtonsContainer.append(navButtonsRightInnerContainer);
    divElementFrame.append(navButtonsContainer, divElementBody);

    divElementBody.innerHTML = innerHtml;

    const getHtmlElement = function() : HTMLDivElement {
        return divElementFrame;
    };

    const setInnerHtml = function(innerHtml: string) {
        divElementBody.innerHTML = innerHtml;
    }
    
    const setInnerNode = function(innerNode: Node) {

        divElementFrame.innerHTML = "";
        navButtonsContainer.innerHTML = "";
        if (localData.onReturn === null ) {
            navButtonsContainer.append(navButtonsRightInnerContainer);
        } else {
            navButtonsContainer.append(navButtonsRightInnerContainer, backButton);
        }

        setInnerHtml("");
        divElementBody.append(innerNode);
        divElementFrame.append(navButtonsContainer, divElementBody);
    }

    const displayTaskListAsync = async function(refresh: boolean, tabId: string) {
        localData.onReturn = null;
        const taskList = new TaskListComponent(navigation, tabId);
        localData.tabId = tabId;
        if(refresh === true) {
            const fetchResult = await taskList.fetchData();
            if (fetchResult) {
                localData.tasks = fetchResult;
            } else {
                onSignOut("sign-out");
            }
        } else {
            taskList.setData(localData.tasks);
        }
        const nodeToAdd = await taskList.render();
        if(nodeToAdd!= null){
            setInnerNode(nodeToAdd);
        }
    }

    const displayTaskDetailsAsync = async (taskData: TaskData, refresh: boolean) => {
        localData.taskId = taskData.id;
        if (localData.tabId) {
            localData.onReturn = () => { displayTaskListAsync(false, localData.tabId as string); };
        }
        const taskDetails = new TaskDetailsComponent(navigation, taskData, localData.tasks);

        if(refresh === true){
            setInnerHtml("Loading...");
            const fetchResult = await taskDetails.fetchData();
            if(fetchResult) {
                localData.notes = fetchResult;
            } else {
                localData.onReturn && localData.onReturn();
            }    

            const idx = localData.tasks.findIndex(t => t.id === localData.taskId);
            localData.tasks[idx] = taskData;
        } else {
            taskDetails.setData(localData.notes);
        }

        const nodeToAdd = await taskDetails.render();
        if(nodeToAdd!= null){
            setInnerNode(nodeToAdd);
        }
        else{
            setInnerHtml("failed to show Task Details");
        }

    }

    const displayNoteDetailsAsync = (noteData: NoteData) => {

        if(localData.taskId) {
            localData.noteId = noteData.id;
            const taskIdx = localData.tasks.findIndex(t => t.id === localData.taskId);
            const taskData = localData.tasks[taskIdx];
            const noteDetails = new NoteDetailsComponent(navigation, noteData, localData.notes, localData.taskId, taskData.isCompleted);
            const noteIdx = localData.notes.findIndex(n => n.id === localData.noteId);
            localData.notes[noteIdx] = noteData;
            localData.onReturn = () => { displayTaskDetailsAsync(taskData, false); };
    
            const nodeToAdd = noteDetails.render();
            if(nodeToAdd!= null){
                setInnerNode(nodeToAdd);
            }
            else{
                setInnerHtml("failed to show Note Details");
            }
        }

    }

    navigation.displayTaskListAsync = displayTaskListAsync;
    navigation.displayTaskDetailsAsync = displayTaskDetailsAsync;
    navigation.displayNoteDetailsAsync = displayNoteDetailsAsync;

    return {
        getHtmlElement: getHtmlElement,
        navigation: navigation
    }
}