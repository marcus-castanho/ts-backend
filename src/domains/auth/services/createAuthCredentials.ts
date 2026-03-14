import { db } from '@/infra/db';
import { authTable } from '@/infra/db/schema/auth';
import { hashString } from './hashString';
import { handleDBError } from '@/infra/db/error';

type CreateAuthCredentialsArgs = {
    userId: number;
    email: string;
    password: string;
};
export async function createAuthCredentials({
    userId,
    email,
    password,
}: CreateAuthCredentialsArgs) {
    const { salt, hash } = await hashString({ value: password });

    const result = await db
        .insert(authTable)
        .values({ userId, credentials: { email, password: hash, salt } })
        .catch((error) => ({ error }));

    if (result && 'error' in result) throw handleDBError(result.error);
}
