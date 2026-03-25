import { db } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { handleDBError } from '@/infra/db/error';
import { authBlacklistTable } from '@/infra/db/schema/authBlacklist';

type DeleteRecordArgs = { id: number };
export async function deleteRecord({ id }: DeleteRecordArgs) {
    const result = await db
        .delete(authBlacklistTable)
        .where(eq(authBlacklistTable.id, id))
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) return handleDBError(result.error);
    if (result.length === 0) return null;

    return;
}
