import { userServices } from '@/domains/users';
import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { DOCS } from '@/server/docs';
import { generateQueryHashKey } from '@/infra/cache/utils/generateQueryHashKey';

const dto = {
    querystring: z
        .object({ name: z.string(), email: z.string() })
        .partial()
        .extend({
            page: z.coerce.number().positive(),
            limit: z.coerce.number().positive(),
        }),
} satisfies ReqDataSchema;

export const getCachedUsers: Controller = (route) => {
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
                const { page, limit, ...filter } = req.query;
                const queryKey = generateQueryHashKey({
                    ...req.query,
                    url: req.url,
                });
                const users = await userServices.getCachedUsers({
                    queryKey,
                    filter,
                    pagination: { page, limit },
                });

                return { users };
            },
        );
    };
};
