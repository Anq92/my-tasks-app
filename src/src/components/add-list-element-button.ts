
export const createNewListElementButton = function(eventHandler: (e: Event) => void) {
    const newListElementButton = document.createElement("img");
    newListElementButton.src = "src/images/icons8-plus-64.png";
    newListElementButton.id = "new-list-element-button";

    newListElementButton.addEventListener("click", eventHandler);

    return  newListElementButton;
};