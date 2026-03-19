import { db } from '@/infra/db';
import { Product_1, product_1Schema } from '../entity';
import { handleDBError } from '@/infra/db/error';
import { eq } from 'drizzle-orm';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { products_1Table } from '@/infra/db/schema/products_1';
import { CACHE_TIME, SCHEMA_NAME } from '../consts';
import { KEYSPACE } from '@/infra/cache/consts';
import { client } from '@/infra/cache/client';
import z from 'zod';

type UpdateArgs = {
    id: Product_1['id'];
    payload: Omit<Partial<Product_1>, 'id' | 'createdAt' | 'updatedAt'>;
};
export async function update({ id, payload }: UpdateArgs) {
    const result = await db
        .update(products_1Table)
        .set({ ...payload })
        .where(eq(products_1Table.id, id))
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
        const updatedCache = parsedCached.data.map((cachedRecord) => {
            if (cachedRecord.id === parsedRecord.id) return parsedRecord;
            return cachedRecord;
        });
        await client.json.set(key, '$', updatedCache).then(() => {
            return client.expire(key, CACHE_TIME);
        });
    }

    return parsedRecord;
}
