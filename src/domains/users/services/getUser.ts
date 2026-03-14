import { db, usersTable } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { userSchema } from '../entity';
import { log } from '@/infra/logger';

type GetUserArgs = { id: number };
export async function getUser({ id }: GetUserArgs) {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

    if (!user) return null;

    const parsedUser = userSchema.safeParse(user);
    if (parsedUser.error) {
        log.error(`Users schema inconsistency. Error: ${parsedUser.error}`);
        return { error: { code: '-1', message: 'Schema inconsistency' } };
    }

    return parsedUser.data;
}
