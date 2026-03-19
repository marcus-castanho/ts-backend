import { ReqDataSchema } from '@/server/types';
import { Controller } from '../types';
import z from 'zod';
import { DOCS } from '@/server/docs';
import { products_1Services } from '@/domains/products_1/services';
import { product_1Schema } from '@/domains/products_1/entity';

const dto = {
    params: z.object({ userId: z.coerce.number(), id: z.coerce.number() }),
    body: product_1Schema.pick({ name: true }).partial(),
} satisfies ReqDataSchema;

export const patchProduct_1: Controller = (route) => {
    return (instance) => {
        instance.patch(
            route,
            {
                schema: {
                    ...dto,
                    tags: [DOCS.tags.products_1],
                    security: [{ [DOCS.authType]: [] }],
                },
            },
            async (req) => {
                const { ...payload } = req.body;
                const data = await products_1Services.update({
                    id: req.params.id,
                    payload,
                });

                return data;
            },
        );
    };
};
