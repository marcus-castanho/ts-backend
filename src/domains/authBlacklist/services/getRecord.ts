import { db } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { authBlacklistRecordSchema } from '../entity';
import { log } from '@/infra/logger';
import { authBlacklistTable } from '@/infra/db/schema/authBlacklist';

type GetRecordArgs = { token: string };
export async function getRecord({ token }: GetRecordArgs) {
    const [record] = await db
        .select()
        .from(authBlacklistTable)
        .where(eq(authBlacklistTable.token, token));

    if (!record) return null;

    const parsed = authBlacklistRecordSchema.safeParse(record);
    if (parsed.error) {
        log.error(
            `Auth black list schema inconsistency. Error: ${parsed.error}`,
        );
        return { error: { code: '-1', message: 'Schema inconsistency' } };
    }

    return parsed.data;
}
