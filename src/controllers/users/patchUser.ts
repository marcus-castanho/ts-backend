import { ReqDataSchema } from '@/server/types';
import { Controller } from '../types';
import z from 'zod';
import { userSchema, userServices } from '@/domains/users';
import { ERROR } from '@/infra/db/error';
import { authServices } from '@/domains/auth';
import { DOCS } from '@/server/docs';

const dto = {
    params: z.object({ id: z.coerce.number() }),
    body: userSchema
        .pick({ email: true, name: true })
        .extend({ password: z.string() })
        .partial(),
} satisfies ReqDataSchema;

export const patchUser: Controller = (route) => {
    return (instance) => {
        instance.patch(
            route,
            {
                schema: {
                    ...dto,
                    tags: [DOCS.tags.users],
                    security: [{ [DOCS.authType]: [] }],
                },
            },
            async (req) => {
                const { password, ...payload } = req.body;
                const user = await userServices.updateUser({
                    id: req.params.id,
                    payload,
                });

                if (password) {
                    await authServices.updatedAuthCredentials({
                        userId: user.id,
                        password,
                    });
                }

                return user;
            },
        );
    };
};
