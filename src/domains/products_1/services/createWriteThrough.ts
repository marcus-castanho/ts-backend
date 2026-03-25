import { Product_1, product_1Schema } from '../entity';
import { CACHE_TIME } from '../consts';
import { client } from '@/infra/cache/client';
import { KEYSPACE } from '@/infra/cache/consts';
import z from 'zod';
import { create } from './create';

type CreateWriteThroughArgs = {
    payload: Omit<Product_1, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function createWriteThrough({ payload }: CreateWriteThroughArgs) {
    const record = await create({ payload });
    const key = `${KEYSPACE['query:products_1:user']}:${record.userId}`;
    const cached = await client.json.get(key);
    const parsedCached = z.array(product_1Schema).safeParse(cached);
    if (parsedCached.success) {
        await client.json
            .set(key, '$', [...parsedCached.data, record])
            .then(() => {
                return client.expire(key, CACHE_TIME);
            });
    }

    return record;
}
