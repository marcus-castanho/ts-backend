import z from 'zod';
import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import { userServices } from '@/domains/users';
import { DOCS } from '@/server/docs';

const dto = {
    params: z.object({ id: z.coerce.number() }),
} satisfies ReqDataSchema;

export const getUser: Controller = (route) => {
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
            async (req, res) => {
                const user = await userServices.getUser({ id: req.params.id });

                if (!user) return res.status(404).send();

                return user;
            },
        );
    };
};
