export type ValidationResult<E, T> = {
    invalidReasons: E[],
    result: T | undefined,
};