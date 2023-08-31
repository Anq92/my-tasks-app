import NamedData, { INavigation, TaskData } from '../models/models'
import { TasksHttpService } from '../services/tasks.service'
import { htmlElementToDocumentFragment } from '../helpers/dom-helpers';
import { ListComponent } from './shared/list.component';
import { createTabSelector } from './shared/tab-panel.component';
import { Tab } from './shared/tab.component';
import { createNewListElementButton } from './add-list-element-button';
import { uniqueName } from '../helpers/unique-name';
import { viewAlertBox } from './shared/alert-box.components';
import { loadingMessage } from './shared/loading-message';
import { handleRequest } from '../services/handle-http-request';
import { GenericResponse } from '../models/models';
import { dateToHtmlDateInput } from '../helpers/time-format-converters';

function orderTasksByDate(tasks: TaskData[]) {
    tasks.sort(function(a,b) {
        const date1 : number = new Date(a.dueDate).valueOf();
        const date2 : number = new Date(b.dueDate).valueOf();
        const compare = date1-date2;
        return compare;
    })
}


async function createNewTask(tasks: TaskData[], id: string, newTask: TaskData) {

    newTask.id = id;
    tasks.push(newTask);

}

const todoTabConfig = {
    tabId: 'todo_tab',
    tabName: 'To Do'
};

const completedTabConfig = {
    tabId: 'completed_tab',
    tabName: 'Completed'
};

export class TaskListComponent {
    private tasksHttpService = new TasksHttpService();
    private navigation: INavigation;
    private class = "content";
    private id = "tasks";
    private headerText = "My tasks";
    private taskListItemClass = "task";
    private listName = "tasks-list"
    private selectedTabId: string = todoTabConfig.tabId;
    public tasks: TaskData[] = [];
    public currentTaskList: TaskData[] = [];

    constructor(navigation : INavigation, selectedTabId: string) {
        this.navigation = navigation;
        this.selectedTabId = selectedTabId;
    }

    public async fetchData() : Promise<false | TaskData[]> {
        const request = async () => { return this.tasksHttpService.getTasks()};
        const response = await handleRequest(request);

        if(response) {
            this.tasks = response.data as TaskData[];
            orderTasksByDate(this.tasks)
            this.showTodo();
            return this.tasks;
        } else {
            return false;
        }

    }

    public setData(tasks: TaskData[]){
        this.tasks = tasks;
        orderTasksByDate(this.tasks)
        this.showTodo(); 
    }

    public async render(){
        const html = await this.getHtmlElement();
        const thisComponentDocumentFragment = htmlElementToDocumentFragment(html);
        return thisComponentDocumentFragment.firstChild;
    }

    private async getHtmlElement() : Promise<HTMLElement> {
        const outerBody = document.createElement("div");
        outerBody.id = this.id;
        const innerBody = await this.getInnerHtmlElement();
        outerBody.append(innerBody);
        return outerBody;
    }

    private async getInnerHtmlElement() {
        
        const tasksHttpService = this.tasksHttpService;
        const selectedTabId = this.selectedTabId;
        const currentAllTasks = this.tasks;
        const localNavigation = this.navigation;
        const errorMessage = document.createElement("div");
        const emptyListText = this.selectedTabId == completedTabConfig.tabId
        ? "You haven't finished anything..." 
        : "Currently you don't have any tasks <3";

        function newTaskButtonClickActionFactory() {
            const eventHandler = async () => {
                const newTask : TaskData = {
                    name: uniqueName("New Task", currentAllTasks),
                    description: "",
                    isCompleted: false,
                    dueDate: new Date().toISOString(),
                    createdOn: new Date().toISOString()
                }
                loadingMessage("Loading...");
                const request =  async () => { return tasksHttpService.addNewTask(newTask) };
                const response = await handleRequest(request) as GenericResponse<TaskData[]>;

                if(response) {
                    createNewTask(currentAllTasks, response.data[0].id!, newTask);
                }
                await localNavigation.displayTaskListAsync(false, selectedTabId);
            };
            
            return eventHandler;
        }

        function onItemClickActionFactory(dataId : string) {
            const eventHandler = async () => {
                const currentTask = currentAllTasks.find(i=>i.id === dataId);
                if(currentTask !== undefined){
                    await localNavigation.displayTaskDetailsAsync(currentTask, true);
                } else {
                    viewAlertBox(`didnt find task with id ${dataId}`);
                }
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
                const request = async () => { return tasksHttpService.deleteTask(dataId) };
                const response = await handleRequest(request);
                if (response) {
                    deleteTask(dataId, currentAllTasks);
                }

                localNavigation.displayTaskListAsync(false, selectedTabId);
            }
        
            return eventHandler;
        }

        function deleteTask(taskId: string, tasks: TaskData[]) {
  
                const currentTasks = tasks.filter(t => t.id !== taskId);
                tasks.splice(0, tasks.length, ...currentTasks);
        
        }

        const addButtonOnClick = newTaskButtonClickActionFactory();

        let currentTasks: TaskData[];
        if(this.selectedTabId == completedTabConfig.tabId){
            currentTasks = this.showCompleted();
        } else{
            currentTasks = this.showTodo();
        }

        function getDate(data: NamedData) : string {
            const taskData : TaskData = data as TaskData;
            const date = dateToHtmlDateInput(taskData.dueDate);
            return date!;
        };

        const listComponent = new ListComponent(
            emptyListText,
            currentTasks, 
            this.taskListItemClass, 
            this.listName,
            getDate,
            onRemoveActionFactory,
            onItemClickActionFactory);

        const listElement = await listComponent.render();

        const tabSelector = createTabSelector();

        tabSelector.addTabPanelElement(this.selectedTabId == todoTabConfig.tabId, 
            todoTabConfig.tabName, 
            todoTabConfig.tabId, 
            tabId => {
                localNavigation.displayTaskListAsync(
                    false,
                    tabId);
        });

        tabSelector.addTabPanelElement(this.selectedTabId == completedTabConfig.tabId, 
            completedTabConfig.tabName, 
            completedTabConfig.tabId, 
            tabId => {
                localNavigation.displayTaskListAsync(
                    false,
                    tabId);
        });

        const tabComponent = new Tab(listElement);

        const tabElement = tabComponent.render();

        const headerElement = document.createElement("h1");
        headerElement.innerHTML = this.headerText;
        headerElement.className = "page-header";

        const body = document.createElement("div");
        body.id = `${this.id}_inner`;
        body.classList.add(`${this.class}`);

        body.append(
            headerElement, 
            tabSelector.getTabSelector(), 
            tabElement, errorMessage);

        if(selectedTabId === todoTabConfig.tabId){
            const taskButtonElement = createNewListElementButton(addButtonOnClick);
            body.append(taskButtonElement);
        }
        
        return body;
    }

    private showTodo() {
        this.currentTaskList = this.tasks.filter(t=>!t.isCompleted);
        return this.currentTaskList;
    }

    private showCompleted() {        
        this.currentTaskList = this.tasks.filter(t=>t.isCompleted);
        return this.currentTaskList;
    }
}