import { db, usersTable } from '@/infra/db';
import { and, ilike } from 'drizzle-orm';
import { userSchema } from '../entity';
import { log } from '@/infra/logger';
import z from 'zod';

type GetUsersArgs = { filter: { name?: string; email?: string } };
export async function getUsers({ filter }: GetUsersArgs) {
    const users = await db
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
        );

    const parsedUsers = z.array(userSchema).safeParse(users);
    if (parsedUsers.error) {
        log.error(`Users schema inconsistency. Error: ${parsedUsers.error}`);
        return { error: { code: '-1', message: 'Schema inconsistency' } };
    }

    return parsedUsers.data;
}
