import { db } from '@/infra/db';
import { eq } from 'drizzle-orm';
import { handleDBError } from '@/infra/db/error';
import { products_1Table } from '@/infra/db/schema/products_1';

type RemoveArgs = { id: number };
export async function remove({ id }: RemoveArgs) {
    const result = await db
        .delete(products_1Table)
        .where(eq(products_1Table.id, id))
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) throw handleDBError(result.error);

    return;
}
