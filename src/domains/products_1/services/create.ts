import { db } from '@/infra/db';
import { Product_1, product_1Schema } from '../entity';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { products_1Table } from '@/infra/db/schema/products_1';
import { CACHE_TIME, SCHEMA_NAME } from '../consts';
import { client } from '@/infra/cache/client';
import { KEYSPACE } from '@/infra/cache/consts';
import z from 'zod';

type CreateArgs = {
    payload: Omit<Product_1, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function create({ payload }: CreateArgs) {
    const result = await db
        .insert(products_1Table)
        .values({ ...payload })
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);
    const parsedRecord = await validateSchema(
        SCHEMA_NAME,
        result[0],
        product_1Schema,
    );

    const key = `${KEYSPACE['query:products_1:user']}:${parsedRecord.userId}`;
    const cached = await client.json.get(key);
    const parsedCached = z.array(product_1Schema).safeParse(cached);
    if (parsedCached.success) {
        await client.json
            .set(key, '$', [...parsedCached.data, parsedRecord])
            .then(() => {
                return client.expire(key, CACHE_TIME);
            });
    }

    return parsedRecord;
}
