import { FastifyInstance } from 'fastify';
import {
    DBError,
    SchemaInconsistencyError,
    UniqueConstraintConflictError,
} from '@/infra/db/error';
import { log } from '@/infra/logger';

type ErrorHandlerFn = Parameters<FastifyInstance['setErrorHandler']>[0];

export const handleError: ErrorHandlerFn = (error, req, res) => {
    if (error instanceof DBError) {
        if (error instanceof UniqueConstraintConflictError) {
            return res.status(400).send({
                statusCode: 400,
                error: 'Conflict data error',
                message: 'Unique values already in use',
            });
        }
        if (error instanceof SchemaInconsistencyError) {
            return res.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'Internal Server Error',
            });
        }
    }

    //@ts-expect-error - error ype unknown
    log.error(`Unexpected error. Error: ${error?.message} `);
    return res.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Internal Server Error',
    });
};
