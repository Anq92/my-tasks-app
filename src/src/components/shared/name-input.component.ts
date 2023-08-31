export function createNameInputArea(defaultName: string, disabled : boolean | undefined) {

    const nameDiv = document.createElement("div"); 
    nameDiv.className = "name-area-container";
    if(disabled) {
        nameDiv.classList.add("disable");
    }
    nameDiv.innerHTML = defaultName;
    const nameTextArea = document.createElement("textarea");
    nameTextArea.id = "name-input";

    if (!nameDiv) {
        return;
    }

    nameTextArea.innerHTML = defaultName;

    if(!disabled) {
        nameDiv.addEventListener("click", () => {
            nameTextArea.style.height = nameDiv.offsetHeight.toString() + "px";
            nameDiv.innerHTML = "";
            nameDiv.append(nameTextArea);
            nameTextArea.focus();
        });
    
        nameTextArea.addEventListener("click", (e) => {
            e.stopPropagation();
    
        });
    
        nameTextArea.addEventListener("focusout", () => {
            const newName = nameTextArea.value;
            nameDiv.innerHTML = newName;
        });
    
    }

    return nameDiv;
}