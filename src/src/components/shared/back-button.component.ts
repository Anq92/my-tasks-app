export function createBackButton(event: () => void) : HTMLElement {
    
    const backButton = document.createElement("input");
    backButton.type = "image";
    backButton.id = "button-return";
    backButton.src= "src/images/icons8-left-arrow-50.png";
    backButton.addEventListener("click", async () => {
        event();
    });
    return backButton;
}
