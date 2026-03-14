import { db, usersTable } from '@/infra/db';
import { User, userSchema } from '../entity';
import { log } from '@/infra/logger';
import { catchError } from '@/infra/db/error';
import { eq } from 'drizzle-orm';

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

    if ('error' in result) return catchError(result.error);

    const parsedUser = userSchema.safeParse(result[0]);
    if (parsedUser.error) {
        log.error(`Users schema inconsistency. Error: ${parsedUser.error}`);
        return { error: { code: '-1', message: 'Schema inconsistency' } };
    }

    return result[0];
}
