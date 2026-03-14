import { db, usersTable } from '@/infra/db';
import { User, userSchema } from '../entity';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';

type CreateUserArgs = {
    payload: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function createUser({ payload }: CreateUserArgs) {
    const result = await db
        .insert(usersTable)
        .values({ ...payload })
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);
    const parsedUser = await validateSchema('User', result[0], userSchema);

    return parsedUser;
}
