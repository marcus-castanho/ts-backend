import { log } from '@/infra/logger';
import { z } from 'zod';

type Schema<T extends z.ZodRawShape> = z.ZodObject<T>;

export async function validateResBody<T extends z.ZodRawShape>(
    payload: unknown,
    schema: Schema<T>,
) {
    const validation = await schema.safeParseAsync(payload);

    const { success, error } = validation;

    if (!success) {
        log.error(`Invalid response body format - Error: ${error.issues}`);
        throw new Error('Invalid response body format');
    }

    return validation.data;
}
