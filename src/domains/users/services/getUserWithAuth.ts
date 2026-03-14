import { db, usersTable } from '@/infra/db';
import { eq, or } from 'drizzle-orm';
import { userSchema } from '../entity';
import { log } from '@/infra/logger';
import { authTable } from '@/infra/db/schema/auth';
import { authSchema } from '@/domains/auth';
import z from 'zod';
import { catchError } from '@/infra/db/error';

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

    if ('error' in result) return catchError(result.error);

    const [record] = result;
    if (!record) return null;

    const parsedResult = z
        .object({ users: userSchema, auth: authSchema.nullable() })
        .safeParse(record);

    if (parsedResult.error) {
        log.error(
            `Users or auth schema inconsistency. Error: ${parsedResult.error}`,
        );
        return { error: { code: '-1', message: 'Schema inconsistency' } };
    }

    return parsedResult.data;
}
