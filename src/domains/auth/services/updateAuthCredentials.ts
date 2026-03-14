import { db } from '@/infra/db';
import { usersTable } from '@/infra/db/schema/users';
import { hashString } from './hashString';
import { eq } from 'drizzle-orm';
import { authTable } from '@/infra/db/schema/auth';
import { createAuthCredentials } from './createAuthCredentials';

type UpdateAuthCredentialsArgs = {
    userId: number;
    password: string;
};
export async function updatedAuthCredentials({
    userId,
    password,
}: UpdateAuthCredentialsArgs) {
    const { salt, hash } = await hashString({ value: password });
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));
    const [previous] = await db
        .select()
        .from(authTable)
        .where(eq(authTable.userId, userId));

    if (!previous?.credentials && user?.email) {
        await createAuthCredentials({ userId, email: user.email, password });
        return;
    }

    if (previous?.credentials) {
        await db
            .update(authTable)
            .set({
                userId,
                credentials: { ...previous.credentials, password: hash, salt },
            })
            .where(eq(authTable.userId, userId));

        return;
    }
}
