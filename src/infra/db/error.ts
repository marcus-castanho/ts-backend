import { log } from '@/infra/logger';

export const ERROR = {
    UNIQUE_CONSTRAINT: '23505',
};

export function catchError(error) {
    log.error(
        `Error in DB. Error ${error?.cause.code}: ${error?.cause} - ${error?.message} `,
    );
    return {
        error: {
            code: error?.cause.code || `-1`,
            message: error?.message || '',
        },
    };
}
