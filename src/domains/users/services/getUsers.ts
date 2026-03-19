import { db, usersTable } from '@/infra/db';
import { and, ilike } from 'drizzle-orm';
import { userSchema } from '../entity';
import z from 'zod';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { SCHEMA_NAME } from '../consts';

type GetUsersArgs = {
    filter: { name?: string; email?: string };
    pagination: { page: number; limit: number };
};
export async function getUsers({ filter, pagination }: GetUsersArgs) {
    const { page, limit } = pagination;

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
        .limit(limit)
        .offset((page - 1) * limit)
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);
    const { users } = await validateSchema(
        SCHEMA_NAME,
        { users: result },
        z.object({ users: z.array(userSchema) }),
    );

    return users;
}
