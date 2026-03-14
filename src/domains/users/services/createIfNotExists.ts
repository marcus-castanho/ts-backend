import { User } from '../entity';
import { getUserWithAuth } from './getUserWithAuth';
import { createUser } from './createUser';

type CreateUserArgs = {
    payload: Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function createIfNotExists({ payload }: CreateUserArgs) {
    const result = await getUserWithAuth({
        identifier: { email: payload.email },
    });

    if (result && 'users' in result) return { user: result.users, new: false };

    const user = await createUser({ payload });

    return { user, new: true };
}
