import { db } from '@/infra/db';
import { lt } from 'drizzle-orm';
import { catchError } from '@/infra/db/error';
import { authBlacklistTable } from '@/infra/db/schema/authBlacklist';

type DeleteManyArgs = { date: Date };
export async function deleteMany({ date }: DeleteManyArgs) {
    const result = await db
        .delete(authBlacklistTable)
        .where(lt(authBlacklistTable.expiresAt, date))
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) return catchError(result.error);
    if (result.length === 0) return null;

    return;
}
