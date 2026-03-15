import { userSchema, userServices } from '@/domains/users';
import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { DOCS } from '@/server/docs';
import { client } from '@/infra/cache/client';
import { jsonSafeParse } from '@/lib/jsonSafeParse';
import { jsonSafeStringify } from '@/lib/jsonSafeStringify';

const CACHE_KEY = 'users';
const CACHE_TIME = 60;

const dto = {
    querystring: z.object({ name: z.string(), email: z.string() }).partial(),
} satisfies ReqDataSchema;

export const getCachedUsers: Controller = (route) => {
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
                const cached = await client.get(CACHE_KEY);
                const parsedCached = z
                    .array(userSchema)
                    .safeParse(jsonSafeParse(cached));

                if (parsedCached.success) return { users: parsedCached.data };

                const users = await userServices.getUsers({
                    filter: { ...req.query },
                });
                await client.setEx(
                    CACHE_KEY,
                    CACHE_TIME,
                    jsonSafeStringify(users),
                );

                return { users };
            },
        );
    };
};
