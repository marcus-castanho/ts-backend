import { KEYSPACE } from '@/infra/cache/consts';
import { CACHE_TIME } from '../consts';
import { product_1Schema } from '../entity';
import { client } from '@/infra/cache/client';
import z from 'zod';
import { remove } from './remove';

type RemoveWriteThroughArgs = { id: number };
export async function removeWriteThrough({ id }: RemoveWriteThroughArgs) {
    const record = await remove({ id });

    if (!record) return null;

    const key = `${KEYSPACE['query:products_1:user']}:${record.userId}`;
    const cached = await client.json.get(key);
    const parsedCached = z.array(product_1Schema).safeParse(cached);
    if (parsedCached.success) {
        const updatedCache = parsedCached.data.filter((cachedRecord) => {
            return cachedRecord.id !== record.id;
        });
        await client.json.set(key, '$', updatedCache).then(() => {
            return client.expire(key, CACHE_TIME);
        });
    }

    return record;
}
