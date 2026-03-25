import { Product_1, product_1Schema } from '../entity';
import { CACHE_TIME } from '../consts';
import { KEYSPACE } from '@/infra/cache/consts';
import { client } from '@/infra/cache/client';
import z from 'zod';
import { update } from './update';

type UpdateWriteThroughArgs = {
    id: Product_1['id'];
    payload: Omit<Partial<Product_1>, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function updateWriteThrough({
    id,
    payload,
}: UpdateWriteThroughArgs) {
    const record = await update({ id, payload });

    if (!record) return null;

    const key = `${KEYSPACE['query:products_1:user']}:${record.userId}`;
    const cached = await client.json.get(key);
    const parsedCached = z.array(product_1Schema).safeParse(cached);
    if (parsedCached.success) {
        const updatedCache = parsedCached.data.map((cachedRecord) => {
            if (cachedRecord.id === record.id) return record;
            return cachedRecord;
        });
        await client.json.set(key, '$', updatedCache).then(() => {
            return client.expire(key, CACHE_TIME);
        });
    }

    return record;
}
