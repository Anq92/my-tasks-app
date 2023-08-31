import { viewAlertBox } from "../components/shared/alert-box.components";
import NamedData, { GenericResponse } from "../models/models";
import { Constants } from "../models/consts";

export async function handleRequest(request: () => Promise<Response>) {
    
    let response;
    let responseObj : GenericResponse<NamedData[]> | undefined;

    if(navigator.onLine) {
        try {
            response = await request();
        } catch(error) {
            viewAlertBox(`Error: ${error}`)
            return false;
        }

        if(response.ok) {
            responseObj = await response.json();
        } else if (response.status === 401) {
            const onConfirmAction = () => {
                    localStorage.removeItem(Constants.AccessTokenKey);
                    window.location.reload();
            }
            viewAlertBox("Access denied, you will be redirected to the login page.", onConfirmAction);

        } 
        else {
            viewAlertBox(`Error ${response.status}, it wasn't possible to fulfill the request.`);
        }

    } else {
        viewAlertBox("You are offline, the request won't be processed.");
    }

    return responseObj;
}