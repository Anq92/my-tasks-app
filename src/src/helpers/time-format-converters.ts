export function dateToHtmlTimeInput(date : string) {
    if (date === null) {
        return;
    }
    const d = new Date(date);
    const h = d.getHours();
    const m = d.getMinutes();

    const newDate = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    return newDate;
}

export function dateToHtmlDateInput(date : string) {
    if (date === null) {
        return;
    }
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    
    return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
}

export function htmlInputToDate(date: string, time: string) {
    const newDate = date + 'T' + time + ':00';
    return newDate;
}