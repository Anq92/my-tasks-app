export function createTabSelector() {
    const tabPanelHeader = document.createElement("div");
    const tabHeadersWrapper = document.createElement("div")
    const line = document.createElement("hr");
    tabHeadersWrapper.classList.add("tabs");
    tabPanelHeader.append(tabHeadersWrapper, line);

    function getTabSelector() {
        return tabPanelHeader;
    }

    function getTabHeadersWrapper() {
        return tabHeadersWrapper;
    }

    function addTabPanelElement(
        selected: boolean, 
        tabName: string, 
        tabId: string,
        onTabClicked: (tabId: string) => void
        ) {
        const tabElement = document.createElement("h3");
        tabElement.classList.add("tab");
        if (selected) {
            tabElement.classList.add("bold");
        }
        tabElement.innerHTML = tabName;
        tabElement.addEventListener("click", () => {
            onTabClicked(tabId);
        });

        tabHeadersWrapper.append(tabElement);
    }

    return {
        getTabHeadersWrapper: getTabHeadersWrapper,
        getTabSelector: getTabSelector,
        addTabPanelElement: addTabPanelElement
    }
};
