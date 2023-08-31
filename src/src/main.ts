import { SignInComponent } from './components/sign-in/sign-in.component';
import { Constants } from './models/consts';
import { createMainBody } from './components/page-body.component';
import { viewAlertBox } from './components/shared/alert-box.components';

const mainContainerId = "container";

async function onSignOutAsync(id:string) {
   runUnauthenticated();
}

async function onSignInAsync(id:string) {
   await runAuthenticated();
}

async function runAuthenticated() {
   const mainBody = createMainBody("Loading...", onSignOutAsync);
   const container = document.getElementById(`${mainContainerId}`);
   if(container === null){
       return;
   }

   if(mainBody === null){
       return;
   }

   const child = container.firstChild;
   if(child !== null){
      child.remove();
   }

   container.append(mainBody.getHtmlElement());
   await mainBody.navigation.displayTaskListAsync(true, 'todo_tab');
}

async function runUnauthenticated() {
   const signInPage = new SignInComponent(onSignInAsync);
   const singInChild = await signInPage.render();
   const container = document.getElementById(`${mainContainerId}`);
   if(container === null){
       return;
   }

   if(singInChild === null){
       return;
   }

   const child = container.firstChild;
   if(child !== null){
      child.remove();
   }

   container.append(singInChild);
}

let run: () => Promise<void>;

if (localStorage.getItem(Constants.AccessTokenKey) === null) {
   run = runUnauthenticated;
}
else {
   run = runAuthenticated;
}

run();