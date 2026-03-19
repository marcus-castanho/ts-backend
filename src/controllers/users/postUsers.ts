import { ReqDataSchema } from '@/server/types';
import { Controller } from '../types';
import z from 'zod';
import { userServices } from '@/domains/users';
import { authServices } from '@/domains/auth';
import { DOCS } from '@/server/docs';

const dto = {
    body: z.object({
        name: z.string(),
        email: z.string(),
        credentials: z.object({ password: z.string() }),
    }),
} satisfies ReqDataSchema;

export const postUsers: Controller = (route) => {
    return (instance) => {
        instance.post(
            route,
            {
                schema: { ...dto, tags: [DOCS.tags.users] },
            },
            async (req) => {
                const user = await userServices.createUser({
                    payload: req.body,
                });

                const { password } = req.body.credentials;
                await authServices.createAuthCredentials({
                    userId: user.id,
                    email: user.email,
                    password,
                });

                return user;
            },
        );
    };
};
