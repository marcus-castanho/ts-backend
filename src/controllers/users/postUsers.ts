import { ReqDataSchema } from '@/server/types';
import { Controller } from '../types';
import z from 'zod';
import { userServices } from '@/domains/users';
import { ERROR } from '@/infra/db/error';
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
            async (req, res) => {
                const user = await userServices.createUser({
                    payload: req.body,
                });

                if (!user) return res.status(500).send();
                if ('error' in user) {
                    const { error } = user;
                    if (error.code === ERROR.UNIQUE_CONSTRAINT)
                        return res
                            .status(400)
                            .send({ message: 'Unique values already in use' });
                    return res.status(500).send();
                }

                const { password } = req.body.credentials;
                const authResult = await authServices.createAuthCredentials({
                    userId: user.id,
                    email: user.email,
                    password,
                });

                if (authResult && 'error' in authResult) {
                    return res
                        .status(500)
                        .send({ message: 'Failed to create auth credentials' });
                }

                return user;
            },
        );
    };
};
