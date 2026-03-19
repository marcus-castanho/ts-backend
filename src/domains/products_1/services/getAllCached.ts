import { db } from '@/infra/db';
import { and, eq } from 'drizzle-orm';
import { product_1Schema } from '../entity';
import z from 'zod';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { CACHE_TIME, SCHEMA_NAME } from '../consts';
import { products_1Table } from '@/infra/db/schema/products_1';
import { client } from '@/infra/cache/client';
import { KEYSPACE } from '@/infra/cache/consts';

type QueryArgs = {
    filter: { userId: number };
};
export async function getAllCached({ filter }: QueryArgs) {
    const key = `${KEYSPACE['query:products_1:user']}:${filter.userId}`;

    const cached = await client.json.get(key);
    const parsedCached = z.array(product_1Schema).safeParse(cached);

    if (parsedCached.success) return parsedCached.data;

    const result = await db
        .select()
        .from(products_1Table)
        .where(and(eq(products_1Table.userId, filter.userId)))
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);
    const { records } = await validateSchema(
        SCHEMA_NAME,
        { records: result },
        z.object({ records: z.array(product_1Schema) }),
    );

    await client.json.set(key, '$', records).then(() => {
        return client.expire(key, CACHE_TIME);
    });

    return records;
}
