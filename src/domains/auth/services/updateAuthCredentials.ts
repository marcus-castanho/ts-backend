import { db } from '@/infra/db';
import { usersTable } from '@/infra/db/schema/users';
import { hashString } from './hashString';
import { eq } from 'drizzle-orm';
import { authTable } from '@/infra/db/schema/auth';
import { createAuthCredentials } from './createAuthCredentials';
import { handleDBError } from '@/infra/db/error';

type UpdateAuthCredentialsArgs = {
    userId: number;
    password: string;
};
export async function updatedAuthCredentials({
    userId,
    password,
}: UpdateAuthCredentialsArgs) {
    const { salt, hash } = await hashString({ value: password });
    const userResult = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .catch((error) => ({ error }));
    const previousResult = await db
        .select()
        .from(authTable)
        .where(eq(authTable.userId, userId))
        .catch((error) => ({ error }));

    if ('error' in userResult) throw handleDBError(userResult.error);
    if ('error' in previousResult) throw handleDBError(previousResult.error);

    const [user] = userResult;
    const [previous] = previousResult;

    if (!previous?.credentials && user?.email) {
        await createAuthCredentials({ userId, email: user.email, password });
        return;
    }

    if (previous?.credentials) {
        const result = await db
            .update(authTable)
            .set({
                userId,
                credentials: { ...previous.credentials, password: hash, salt },
            })
            .where(eq(authTable.userId, userId))
            .catch((error) => ({ error }));
        if ('error' in result) throw handleDBError(result.error);
    }
}
