import { db, usersTable } from '@/infra/db';
import { and, ilike } from 'drizzle-orm';
import { userSchema } from '../entity';
import z from 'zod';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';

type GetUsersArgs = { filter: { name?: string; email?: string } };
export async function getUsers({ filter }: GetUsersArgs) {
    const result = await db
        .select()
        .from(usersTable)
        .where(
            and(
                filter?.name
                    ? ilike(usersTable.name, `%${filter.name}%`)
                    : undefined,
                filter?.email
                    ? ilike(usersTable.email, `%${filter.email}%`)
                    : undefined,
            ),
        )
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);
    const { users } = await validateSchema(
        'User',
        { users: result },
        z.object({ users: z.array(userSchema) }),
    );

    return users;
}
