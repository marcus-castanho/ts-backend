import { db } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { product_1Schema } from '../entity';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { handleDBError } from '@/infra/db/error';
import { SCHEMA_NAME } from '../consts';
import { products_1Table } from '@/infra/db/schema/products_1';

type GetArgs = { id: number };
export async function get({ id }: GetArgs) {
    const result = await db
        .select()
        .from(products_1Table)
        .where(eq(products_1Table.id, id))
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);

    const [record] = result;
    if (!record) return null;

    const parsedRecord = await validateSchema(
        SCHEMA_NAME,
        record,
        product_1Schema,
    );

    return parsedRecord;
}
