import { log } from '@/infra/logger';
import { CustomError } from '../error';

export const ERROR = {
    SCHEMA_INCONSISTENCY: '-1',
    UNIQUE_CONSTRAINT: '23505',
};

export function handleDBError(error) {
    log.error(
        `Error in DB. Error ${error?.cause.code}: ${error?.cause} - ${error?.message} `,
    );

    if (error?.cause.code === ERROR.UNIQUE_CONSTRAINT)
        throw new UniqueConstraintConflictError();

    return new DBError();
}

export class DBError extends CustomError {
    constructor(
        readonly errorName = 'DBError',
        readonly errorMessage?: string,
    ) {
        super(errorMessage);
        this.name = errorName;
    }
}

export class SchemaInconsistencyError extends DBError {
    constructor(
        readonly errorName = 'SchemaInconsistencyError',
        readonly errorCode = ERROR.SCHEMA_INCONSISTENCY,
        readonly errorMessage?: string,
    ) {
        super(errorMessage);
        this.name = errorName;
    }
}

export class UniqueConstraintConflictError extends DBError {
    constructor(
        readonly errorName = 'UniqueConstraintConflictError',
        readonly errorCode = ERROR.UNIQUE_CONSTRAINT,
        readonly errorMessage?: string,
    ) {
        super(errorMessage);
        this.name = errorName;
    }
}
