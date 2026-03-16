import { userServices } from '@/domains/users';
import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { DOCS } from '@/server/docs';

const dto = {
    querystring: z
        .object({ name: z.string(), email: z.string() })
        .partial()
        .extend({
            page: z.coerce.number().positive(),
            limit: z.coerce.number().positive(),
        }),
} satisfies ReqDataSchema;

export const getUsers: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            {
                schema: {
                    ...dto,
                    tags: [DOCS.tags.users],
                    security: [{ [DOCS.authType]: [] }],
                },
            },
            async (req) => {
                const { page, limit, ...query } = req.query;
                const users = await userServices.getUsers({
                    filter: { ...query },
                    pagination: { page, limit },
                });

                return { users };
            },
        );
    };
};
