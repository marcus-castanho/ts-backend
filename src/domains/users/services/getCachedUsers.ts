import { userSchema } from '../entity';
import z from 'zod';
import { client } from '@/infra/cache/client';
import { jsonSafeParse } from '@/lib/jsonSafeParse';
import { getUsers } from './getUsers';
import { jsonSafeStringify } from '@/lib/jsonSafeStringify';

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

    const cached = await client.get(queryKey);
    const parsedCached = z.array(userSchema).safeParse(jsonSafeParse(cached));

    if (parsedCached.success) return { users: parsedCached.data };

    const users = await getUsers({
        filter,
        pagination: { page, limit },
    });
    await client.set(queryKey, jsonSafeStringify(users), {
        expiration: {
            type: 'EX',
            value: CACHE_TIME,
        },
    });

    return users;
}
