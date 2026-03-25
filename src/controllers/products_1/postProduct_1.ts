import { ReqDataSchema } from '@/server/types';
import { Controller } from '../types';
import z from 'zod';
import { DOCS } from '@/server/docs';
import { products_1Services } from '@/domains/products_1/services';

const dto = {
    params: z.object({ userId: z.coerce.number() }),
    body: z.object({ name: z.string() }),
} satisfies ReqDataSchema;

export const postProduct_1: Controller = (route) => {
    return (instance) => {
        instance.post(
            route,
            {
                schema: { ...dto, tags: [DOCS.tags.products_1] },
            },
            async (req) => {
                const data = await products_1Services.createWriteThrough({
                    payload: { ...req.body, ...req.params },
                });

                return data;
            },
        );
    };
};
