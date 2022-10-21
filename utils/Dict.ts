export type Dict<T> = {
    [key: string]: T;
}

export function toArray<T>(dict?: Dict<T>): T[] {
    return Object.values(dict ?? {});
}