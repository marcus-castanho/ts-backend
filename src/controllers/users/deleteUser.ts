import z from 'zod';
import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import { userServices } from '@/domains/users';
import { DOCS } from '@/server/docs';

const dto = {
    params: z.object({ id: z.coerce.number() }),
} satisfies ReqDataSchema;

export const deleteUser: Controller = (route) => {
    return (instance) => {
        instance.delete(
            route,
            {
                schema: {
                    ...dto,
                    tags: [DOCS.tags.users],
                    security: [{ [DOCS.authType]: [] }],
                },
            },
            async (req, res) => {
                const user = await userServices.deleteUser({
                    id: req.params.id,
                });

                if (user === null) return res.status(404).send();

                return;
            },
        );
    };
};
