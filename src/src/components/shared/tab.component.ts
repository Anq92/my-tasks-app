export class Tab {
    private tabContentContainer? : HTMLDivElement;
    private tabContent : HTMLElement;

    constructor(
        tabContent: HTMLElement) {
        this.tabContent = tabContent;
    }

    public render() {
        this.tabContentContainer = document.createElement("div");
        this.tabContentContainer.id = 'tab-content';
        this.tabContentContainer.append(this.tabContent);
        return this.tabContentContainer;
    }
}