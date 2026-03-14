import { db } from '@/infra/db';
import { log } from '@/infra/logger';
import { catchError } from '@/infra/db/error';
import { authBlacklistTable } from '@/infra/db/schema/authBlacklist';
import { AuthBlackListRecord, authBlacklistRecordSchema } from '../entity';

type Create = {
    payload: Omit<AuthBlackListRecord, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function create({ payload }: Create) {
    const result = await db
        .insert(authBlacklistTable)
        .values({ ...payload })
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) return catchError(result.error);

    const parsed = authBlacklistRecordSchema.safeParse(result[0]);
    if (parsed.error) {
        log.error(
            `Auth black list schema inconsistency. Error: ${parsed.error}`,
        );
        return { error: { code: '-1', message: 'Schema inconsistency' } };
    }

    return (
        result[0] || {
            error: { code: '-1', message: 'Error creating black list record' },
        }
    );
}
