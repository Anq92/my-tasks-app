import NamedData from "../models/models";

export const uniqueName = (defaultName: string, data: NamedData[]) => {;
    let uniqueName = defaultName;
    let i = 1;
    while (data.find(item => item.name === uniqueName)) {
        uniqueName = `${defaultName} ${i}`;
        i++;
    }
    return uniqueName;
}