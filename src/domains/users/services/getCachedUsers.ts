import { userSchema } from '../entity';
import z from 'zod';
import { client } from '@/infra/cache/client';
import { getUsers } from './getUsers';
import { KEYSPACE } from '@/infra/cache/consts';

const CACHE_TIME = 60;

type GetCachedUsersArgs = {
    queryKey: string;
    filter: { name?: string; email?: string };
    pagination: { page: number; limit: number };
};
export async function getCachedUsers({
    queryKey,
    filter,
    pagination,
}: GetCachedUsersArgs) {
    const { page, limit } = pagination;
    const key = `${KEYSPACE['query:users']}:${queryKey}`;

    const cached = await client.json.get(key);
    const parsedCached = z.array(userSchema).safeParse(cached);

    if (parsedCached.success) return parsedCached.data;

    const users = await getUsers({
        filter,
        pagination: { page, limit },
    });
    await client.json.set(key, '$', users).then(() => {
        return client.expire(key, CACHE_TIME);
    });

    return users;
}
