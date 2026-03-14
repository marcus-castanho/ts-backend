import { db, usersTable } from '@/infra/db';
import { eq, or } from 'drizzle-orm';
import { userSchema } from '../entity';
import { authTable } from '@/infra/db/schema/auth';
import { authSchema } from '@/domains/auth';
import z from 'zod';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';

type GetUserWithAuthArgs = { identifier: { id: number } | { email: string } };
export async function getUserWithAuth({ identifier }: GetUserWithAuthArgs) {
    const result = await db
        .select()
        .from(usersTable)
        .where(
            or(
                'id' in identifier
                    ? eq(usersTable.id, identifier.id)
                    : undefined,
                'email' in identifier
                    ? eq(usersTable.email, identifier.email)
                    : undefined,
            ),
        )
        .leftJoin(authTable, eq(usersTable.id, authTable.userId))
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);

    const [record] = result;
    if (!record) return null;

    const parsedResult = await validateSchema(
        'User',
        record,
        z.object({ users: userSchema, auth: authSchema.nullable() }),
    );

    return parsedResult;
}
