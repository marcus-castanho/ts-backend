import { db } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { handleDBError } from '@/infra/db/error';
import { products_1Table } from '@/infra/db/schema/products_1';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { SCHEMA_NAME } from '../consts';
import { product_1Schema } from '../entity';

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

    return parsedRecord;
}
