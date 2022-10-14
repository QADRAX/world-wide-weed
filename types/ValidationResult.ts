export type ValidationResult<T> = {
    invalidReasons: string[],
    result: T | undefined,
};