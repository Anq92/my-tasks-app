import { ApplicationConsts } from '../helpers/consts';
import { Constants } from '../models/consts';
import { TaskData } from '../models/models'

export class TasksHttpService {
    private baseUrl = ApplicationConsts.BaseUrl;

    public async getTasks() : Promise<Response> {
        const endpointUrl = `Task`;

        const response = await fetch(this.baseUrl+endpointUrl, {
            method: 'get',
            headers: this.getHeaders()
        });
        
        return response;
    }

    public async addNewTask(newTask: TaskData) : Promise<Response> {
        const endpointUrl = `Task`;
        const requestBody = JSON.stringify(newTask);

        const response = await fetch(this.baseUrl+endpointUrl, {
            method: 'post',
            headers: this.getHeaders(),
            body: requestBody,
        });

        return response;
    }

    public async changeTaskData(task: TaskData, taskId: string) : Promise<Response> {
        const endpointUrl = `Task/${taskId}`;
        const requestBody = JSON.stringify(task);

        const response = await fetch(this.baseUrl+endpointUrl, {
            method: 'put',
            headers: this.getHeaders(),
            body: requestBody
            });

        return response;
    }

    public async deleteTask(taskId: string) : Promise<Response> {
        const endpointUrl = `Task/${taskId}`;

        const response = await fetch(this.baseUrl+endpointUrl, {
            method: 'delete',
            headers: this.getHeaders()
            });

        return response;
    }

    private getHeaders() {
        const token = localStorage.getItem(Constants.AccessTokenKey);
        const httpHeaders = {
            "Accept": Constants.ContentType,
            "Content-type": Constants.ContentType,
            "Authorization": `Bearer ${token}`
        };
        const newHeaders = new Headers(httpHeaders);
        return newHeaders;
    }
  }
  