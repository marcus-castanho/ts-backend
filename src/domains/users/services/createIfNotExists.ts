import { User } from '../entity';
import { catchError } from '@/infra/db/error';
import { getUserWithAuth } from './getUserWithAuth';
import { createUser } from './createUser';

type CreateUserArgs = {
    payload: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function createIfNotExists({ payload }: CreateUserArgs) {
    const userResult = await getUserWithAuth({
        identifier: { email: payload.email },
    });

    if (userResult && 'error' in userResult)
        return catchError(userResult.error);
    if (userResult && 'users' in userResult)
        return { user: userResult.users, new: false };

    const user = await createUser({ payload });

    if ('error' in user)
        return { error: { code: '-1', message: 'Error creating user' } };

    return { user, new: true };
}
