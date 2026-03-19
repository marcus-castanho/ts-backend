import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { DOCS } from '@/server/docs';
import { products_1Services } from '@/domains/products_1/services';

const dto = {
    params: z.object({ userId: z.coerce.number() }),
} satisfies ReqDataSchema;

export const getCachedAllUserProducts: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            {
                schema: {
                    ...dto,
                    tags: [DOCS.tags.examples],
                    security: [{ [DOCS.authType]: [] }],
                },
            },
            async (req) => {
                const data = await products_1Services.getAllCached({
                    filter: { ...req.params },
                });

                return { products: data };
            },
        );
    };
};
