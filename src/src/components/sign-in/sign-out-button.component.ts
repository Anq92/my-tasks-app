import { Constants } from "../../models/consts";


export function createSignOutButtonHtmlElement(buttonId: string | null, onSignOut: (id: string) => Promise<void>) : HTMLElement {
    const signOutButton = document.createElement("input");
    signOutButton.id = buttonId ?? "sign-out";
    signOutButton.type = "image";
    signOutButton.src = "public/icons8-power-button-64.png"
    signOutButton.addEventListener(
        "click", 
        async () => {
            localStorage.removeItem(Constants.AccessTokenKey);
            await onSignOut(signOutButton.id);
        }, 
        false);

    return signOutButton;
}