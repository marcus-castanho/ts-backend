import z from 'zod';
import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import { DOCS } from '@/server/docs';
import { products_1Services } from '@/domains/products_1/services';

const dto = {
    params: z.object({ id: z.coerce.number() }),
} satisfies ReqDataSchema;

export const getProduct_1: Controller = (route) => {
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
            async (req, res) => {
                const data = await products_1Services.get({
                    id: req.params.id,
                });

                if (!data) return res.status(404).send();

                return data;
            },
        );
    };
};
