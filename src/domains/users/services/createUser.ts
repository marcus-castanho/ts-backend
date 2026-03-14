import { db, usersTable } from '@/infra/db';
import { User, userSchema } from '../entity';
import { log } from '@/infra/logger';
import { catchError } from '@/infra/db/error';

type CreateUserArgs = {
    payload: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function createUser({ payload }: CreateUserArgs) {
    const result = await db
        .insert(usersTable)
        .values({ ...payload })
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) return catchError(result.error);

    const parsedUser = userSchema.safeParse(result[0]);
    if (parsedUser.error) {
        log.error(`Users schema inconsistency. Error: ${parsedUser.error}`);
        return { error: { code: '-1', message: 'Schema inconsistency' } };
    }

    return (
        result[0] || { error: { code: '-1', message: 'Error creating user' } }
    );
}
