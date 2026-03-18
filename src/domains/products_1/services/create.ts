import { db } from '@/infra/db';
import { Product_1, product_1Schema } from '../entity';
import { handleDBError } from '@/infra/db/error';
import { validateSchema } from '@/infra/db/validations/validateSchema';
import { products_1Table } from '@/infra/db/schema/products_1';
import { SCHEMA_NAME } from '../consts';

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

    return parsedRecord;
}
