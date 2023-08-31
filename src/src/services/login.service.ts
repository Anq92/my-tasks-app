import { ApplicationConsts } from '../helpers/consts';

export class LoginHttpService {
    private baseUrl = ApplicationConsts.BaseUrl+'Authentication';

    public async signIn(login: string, password: string) : Promise<Response> {
        const userData = {
            username: login,
            password: password
        }
        const requestBody = JSON.stringify(userData);
    
        const response = await fetch(this.baseUrl, {
            method: 'post',
            headers: { 
            "Accept": "application/json",
            "Content-type": "application/json"},
            body: requestBody
            });

        return response;
    }
}
