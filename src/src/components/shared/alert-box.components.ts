export function viewAlertBox(message: string, onConfirmAction? : () => void, rejectOption: boolean = false) {
    const alertBoxContainer = document.createElement("div");
    alertBoxContainer.id = "alert-box-container";
    const alertBox = document.createElement("div");
    alertBox.id = "alert-box";

    const messageContainer = document.createElement("div");
    messageContainer.id = "alert-message-container";
    messageContainer.innerHTML = message;

    const buttonsContainer = document.createElement("div");
    buttonsContainer.id = "alert-box-buttons"
    const confirmButton = document.createElement("button");
    confirmButton.id = "alert-confirm"
    buttonsContainer.append(confirmButton);

    if (rejectOption) {
        confirmButton.innerHTML = `<span class="alert-button-text">Yes</span>`;
        const rejectButton = document.createElement("button");
        rejectButton.id = "alert-reject"
        rejectButton.innerHTML = `<span class="alert-button-text">No</span>`;
        buttonsContainer.append(rejectButton);

        rejectButton.addEventListener("click", () => {
            alertBoxContainer.remove();
        });

    } else {
        confirmButton.innerHTML = `<span class="alert-button-text">OK</span>`;
    }
    
    alertBox.append(messageContainer, buttonsContainer);
    alertBoxContainer.append(alertBox);

    alertBox.addEventListener("click", (e) => {
        e.stopPropagation();
    })

    alertBoxContainer.addEventListener("click", () => {
        alertBoxContainer.remove();
    });

    confirmButton.addEventListener("click", async () => {
        onConfirmAction && onConfirmAction();
        alertBoxContainer.remove();
    });
    const mainContainer = document.getElementById("container");
    mainContainer?.append(alertBoxContainer);

}