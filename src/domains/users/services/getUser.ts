import { db, usersTable } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { userSchema } from '../entity';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { handleDBError } from '@/infra/db/error';

type GetUserArgs = { id: number };
export async function getUser({ id }: GetUserArgs) {
    const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id))
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);

    const [user] = result;
    if (!user) return null;

    const parsedUser = await validateSchema('User', user, userSchema);

    return parsedUser;
}
