export class CustomError extends Error {
    constructor(
        readonly errorName = 'CustomError',
        readonly errorMessage?: string,
    ) {
        super(errorMessage);
        this.name = errorName;
    }
}
