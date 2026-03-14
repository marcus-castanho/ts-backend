import { log } from '@/infra/logger';
import { db } from './client';
import { env } from '../env';

export async function validateDBConnection() {
    log.info(
        `Validating DB connection. Connection string is ready: ${typeof process.env['DATABASE_URL'] === 'string'} | ${typeof env.DATABASE_URL === 'string'}`,
    );
    await db
        .execute('SELECT 1')
        .then(() => log.info('DB connection ready'))
        .catch((error) => {
            const errorMessage = error?.message || '';
            const errorCause = error?.cause?.message || '';
            log.error(
                `DB connection failed. Error: ${errorMessage} | ${errorCause}`,
            );
            throw new Error('DB Connection failed');
        });
}
