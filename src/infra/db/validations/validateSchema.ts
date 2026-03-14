import { log } from '@/infra/logger';
import { z } from 'zod';
import { SchemaInconsistencyError } from '../error';

type Schema<T extends z.ZodRawShape> = z.ZodObject<T>;

export async function validateSchema<T extends z.ZodRawShape>(
    table: string,
    payload: unknown,
    schema: Schema<T>,
) {
    const validation = await schema.safeParseAsync(payload);

    const { success, error } = validation;

    if (!success) {
        log.error(`${table} schema inconsistency. Error: ${error}`);
        throw new SchemaInconsistencyError();
    }

    return validation.data;
}
