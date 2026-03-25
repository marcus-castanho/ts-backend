import { db } from '@/infra/db';
import { Product_1, product_1Schema } from '../entity';
import { handleDBError } from '@/infra/db/error';
import { eq } from 'drizzle-orm';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { products_1Table } from '@/infra/db/schema/products_1';
import { SCHEMA_NAME } from '../consts';

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

    if (result.length === 0) return null;
    const parsedRecord = await validateSchema(
        SCHEMA_NAME,
        result[0],
        product_1Schema,
    );

    return parsedRecord;
}
