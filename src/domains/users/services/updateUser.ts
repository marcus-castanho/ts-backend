import { db, usersTable } from '@/infra/db';
import { User, userSchema } from '../entity';
import { handleDBError } from '@/infra/db/error';
import { eq } from 'drizzle-orm';
import { validateSchema } from '@/infra/db/validations/validateSchema';

type UpdateUserArgs = {
    id: User['id'];
    payload: Omit<Partial<User>, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function updateUser({ id, payload }: UpdateUserArgs) {
    const result = await db
        .update(usersTable)
        .set({ ...payload })
        .where(eq(usersTable.id, id))
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);
    const parsedUser = await validateSchema('User', result[0], userSchema);

    return parsedUser;
}
