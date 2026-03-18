import { db } from '@/infra/db';
import { and, eq, ilike } from 'drizzle-orm';
import { product_1Schema } from '../entity';
import z from 'zod';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { SCHEMA_NAME } from '../consts';
import { products_1Table } from '@/infra/db/schema/products_1';

type QueryArgs = {
    filter: { userId: number; name?: string };
};
export async function query({ filter }: QueryArgs) {
    const result = await db
        .select()
        .from(products_1Table)
        .where(
            and(
                eq(products_1Table.userId, filter.userId),
                filter?.name
                    ? ilike(products_1Table.name, `%${filter.name}%`)
                    : undefined,
            ),
        )
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);
    const { records } = await validateSchema(
        SCHEMA_NAME,
        { records: result },
        z.object({ records: z.array(product_1Schema) }),
    );

    return records;
}
