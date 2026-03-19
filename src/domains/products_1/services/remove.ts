import { db } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { handleDBError } from '@/infra/db/error';
import { products_1Table } from '@/infra/db/schema/products_1';
import { KEYSPACE } from '@/infra/cache/consts';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { CACHE_TIME, SCHEMA_NAME } from '../consts';
import { product_1Schema } from '../entity';
import { client } from '@/infra/cache/client';
import z from 'zod';

type RemoveArgs = { id: number };
export async function remove({ id }: RemoveArgs) {
    const result = await db
        .delete(products_1Table)
        .where(eq(products_1Table.id, id))
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);

    if (result.length === 0) return null;
    const parsedRecord = await validateSchema(
        SCHEMA_NAME,
        result[0],
        product_1Schema,
    );

    const key = `${KEYSPACE['query:products_1:user']}:${parsedRecord.userId}`;
    const cached = await client.json.get(key);
    const parsedCached = z.array(product_1Schema).safeParse(cached);
    if (parsedCached.success) {
        const updatedCache = parsedCached.data.filter((cachedRecord) => {
            return cachedRecord.id !== parsedRecord.id;
        });
        await client.json.set(key, '$', updatedCache).then(() => {
            return client.expire(key, CACHE_TIME);
        });
    }

    return parsedRecord;
}
