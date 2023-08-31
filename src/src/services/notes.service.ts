import { NoteData } from '../models/models'
import { Constants } from '../models/consts';
import { ApplicationConsts } from '../helpers/consts';

export class NotesHttpService {
    private baseUrl = ApplicationConsts.BaseUrl;

    public async getNotes(taskId: string) : Promise<Response> {
        const endpointUrl = `Task/${taskId}/Note`;
        
        const response = await fetch(this.baseUrl+endpointUrl, {
            method: 'get',
            headers: this.getHeaders()
        });

        return response;
    }
  
    public async addNewNote(newNote: NoteData, taskId: string) : Promise<Response> {
        const endpointUrl = `Task/${taskId}/Note`;
        const requestBody = JSON.stringify(newNote);

        const response = await fetch(this.baseUrl+endpointUrl, {
            method: 'post',
            headers: this.getHeaders(),
            body: requestBody
            });

        return response;
    }

    public async changeNoteData(note: NoteData, taskId: string) : Promise<Response> {
        const endpointUrl = `Task/${taskId}/Note/${note.id}`;
        const requestBody = JSON.stringify(note);

        const response = await fetch(this.baseUrl+endpointUrl, {
            method: 'put',
            headers: this.getHeaders(),
            body: requestBody
            });

        return response;
    }

    public async deleteNote(noteId: string, taskId: string) : Promise<Response> {
        const endpointUrl = `Task/${taskId}/Note/${noteId}`;

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