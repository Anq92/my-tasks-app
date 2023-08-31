import { LoginHttpService } from '../../services/login.service';
import { Constants } from '../../models/consts';
import { IComponent } from '../../models/models';
import { loadingMessage } from '../shared/loading-message';
import { htmlToChildNode } from '../../helpers/dom-helpers';
import { GenericResponse } from '../../models/models';
import { viewAlertBox } from '../shared/alert-box.components';

export class SignInComponent implements IComponent{
    private id = "sign-in";
    private class = "container";
    private onSignIn: (id: string) => Promise<void>;
    
    constructor(onSignIn: (id: string) => Promise<void>){
        this.onSignIn = onSignIn;
    }

    public async render() {

        const html = this.getHtml();

        const thisComponentChildNode = htmlToChildNode(html) as HTMLDivElement;
        this.setupForm(thisComponentChildNode, this.onSignIn);

        return thisComponentChildNode;
    }

    private setupForm(content : HTMLDivElement, onSignIn: (id: string) => Promise<void>) {

        const form = content.querySelector("#user-data");
        if(form === null) {
            return;
        }

        const email = content.querySelector<HTMLInputElement>('#email');
        const password = content.querySelector<HTMLInputElement>('#password');
        const emailMsg = content.querySelector("#email-message");
        const passMsg = content.querySelector("#password-message");

        if(email && password && emailMsg && passMsg){
            form.addEventListener("submit", createListener(email, password, this.id, onSignIn));

            email.addEventListener("focusout", () => {

                
                if (email.value !== "") {
                    if (!email.checkValidity()) {
                        emailMsg!.innerHTML = "Please enter a valid email address.";
                    } else {
                        emailMsg!.innerHTML = "";
                    }
                } else {
                    emailMsg!.innerHTML = "Please enter your email address.";
                }

            });

            password.addEventListener("focusout", () => {
                

                if (password.value === ""){
                    passMsg!.innerHTML = "Please enter your password."
            
                } 
            });

            form.addEventListener("invalid", (e) => {
                e.preventDefault();
            });

            password.addEventListener("focus", () => {
                passMsg.innerHTML = ""
            });

            email.addEventListener("focus", () => {
                emailMsg.innerHTML = ""
            });
        } 

        async function handleRequest(request: () => Promise<Response>) {
    
            let response;
            let responseObj : GenericResponse<string> | undefined;
        
            if(navigator.onLine) {
                try {
                    response = await request();
                } catch(error) {
                    viewAlertBox(`Error: ${error}`)
                    return false;
                }
        
                if(!response.ok && response.status!== 401) {
                    viewAlertBox(`Error ${response.status}, it wasn't possible to fulfill the request.`);
                } 
    
                else {
                    responseObj = await response.json();
                }
        
            } else {
                viewAlertBox("You are offline, the request won't be processed.");
            }
        
            return responseObj;
        }

        function createListener(email: HTMLInputElement, password: HTMLInputElement, id: string, onSignIn: (id: string) => Promise<void>): (e: Event) => Promise<void>{

            const loginHttpService = new LoginHttpService();
    
            return async (e : Event) => { 
                const passMsg = document.getElementById("password-message");
                const emailMsg = document.getElementById("email-message");
                e.preventDefault();
                e.stopPropagation();
                

                if (email.checkValidity()) {
                    emailMsg!.innerHTML = "";
                }
                if(email.value === "") {
                    emailMsg!.innerHTML = "Please enter your email";
                }
                if (password.value === "") {
                    passMsg!.innerHTML = "Please enter your password.";
                } else {
                    const message = loadingMessage("Checking data...");
                    const request = async () => { return loginHttpService.signIn(email.value, password.value)}
                    const response = await handleRequest(request);
                    message.remove();
                    
                    if (response && response.isSuccess) {
                        localStorage.setItem(Constants.AccessTokenKey, response.data);
                        localStorage.setItem("username", email.value);
                        loadingMessage("Loading...");
                        await onSignIn(id);
                    } else if (response && !response.isSuccess) {
                        passMsg!.innerHTML = "Wrong password!";
                    } else {
                        return;
                    }
                }
            };
        };
    
    }



    private getHtml() : string {
        const body =
        `<div id="${this.id}" class="${this.class}">
            <div class="content">
                <h1>Sign in!</h1>
                <form id="user-data">
                    <input type="email" id="email" placeholder="Email">
                    <div id="email-message"></div>
                    <input type="password" id="password" placeholder="Password">
                    <div id="password-message"></div>
                    <button id="submit" type="submit"><span class="button-text">Sign in</span></button>
                </form>
            </div>
        </div>`;

        return body;
    }
}