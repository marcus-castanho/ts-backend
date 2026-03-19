import { db, usersTable } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { userSchema } from '../entity';
import { SCHEMA_NAME } from '../consts';

type DeleteUserArgs = { id: number };
export async function deleteUser({ id }: DeleteUserArgs) {
    const result = await db
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);

    if (result.length === 0) return null;
    const parsedRecord = await validateSchema(
        SCHEMA_NAME,
        result[0],
        userSchema,
    );

    return parsedRecord;
}
