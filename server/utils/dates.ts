export const FORMAT_OPTIONS: Intl.DateTimeFormatOptions = { 
    year: '2-digit', 
    month: '2-digit', 
    day: '2-digit',
    minute: 'numeric',
    hour: 'numeric',
    second: '2-digit',
};

export const formatDate = (date: number | Date) => {
    const d = new Date(date);
    const formatedDate = d.toLocaleDateString('en-US', FORMAT_OPTIONS);
    return formatedDate;
}