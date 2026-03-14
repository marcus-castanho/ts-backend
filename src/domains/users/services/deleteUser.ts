import { db, usersTable } from '@/infra/db';
import { eq } from 'drizzle-orm';

import { catchError } from '@/infra/db/error';

type DeleteUserArgs = { id: number };
export async function deleteUser({ id }: DeleteUserArgs) {
    const result = await db
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) return catchError(result.error);
    if (result.length === 0) return null;

    return;
}
