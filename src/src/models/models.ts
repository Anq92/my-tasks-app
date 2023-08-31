export default interface NamedData {
    id?: string,
    name: string,
}

export interface INavigation {
    displayTaskListAsync: (refresh: boolean, tabId: string) => Promise<void>,
    displayTaskDetailsAsync: (taskData:TaskData, refresh: boolean) => Promise<void>,
    displayNoteDetailsAsync: (noteData:NoteData) => void,
}

export interface IComponent {
    render : () => Promise<ChildNode | null>,
}

export interface NoteData extends NamedData {
    taskId: string,
    description: string,
    createdOn: string
}

export interface DataWithDates extends NamedData {
    createdOn?: string,
    dueDate?: string
}

export interface TaskData extends DataWithDates {
    description: string,
    isCompleted: boolean,
    dueDate: string,
    createdOn?: string
}

export interface GenericResponse<TData> {
    data: TData,
    message: string,
    isSuccess: boolean
}