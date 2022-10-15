export type ValidationResult<E, T> = {
    errors: E[],
    result: T | undefined,
};