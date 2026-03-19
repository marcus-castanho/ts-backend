import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { DOCS } from '@/server/docs';
import { product_1Schema } from '@/domains/products_1/entity';
import { products_1Services } from '@/domains/products_1/services';

const dto = {
    params: z.object({ userId: z.coerce.number() }),
    querystring: product_1Schema.pick({ name: true }).partial(),
} satisfies ReqDataSchema;

export const getProducts_1: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            {
                schema: {
                    ...dto,
                    tags: [DOCS.tags.products_1],
                    security: [{ [DOCS.authType]: [] }],
                },
            },
            async (req) => {
                const data = await products_1Services.query({
                    filter: { ...req.query, ...req.params },
                });

                return { products: data };
            },
        );
    };
};
