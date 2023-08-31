export function loadingMessage(message: string) {
    const pageContainer = document.querySelector(".container");
    const onLoading = document.createElement("div");
    onLoading.id = "on-loading-element";

    const textDiv = document.createElement("div");
    textDiv.id = "on-loading-text-container";
    const innerText = document.createElement("span");
    innerText.innerHTML = message;
    
    textDiv.append(innerText);
    onLoading.append(textDiv);
    pageContainer?.append(onLoading);
    return onLoading;
}