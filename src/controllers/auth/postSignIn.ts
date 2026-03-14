import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { userServices } from '@/domains/users';
import {
    authServices,
    JWT_COOKIE_NAME,
    JWT_COOKIE_OPTIONS,
} from '@/domains/auth';
import { DOCS } from '@/server/docs';

const dto = {
    body: z.object({ email: z.string(), password: z.string() }),
} satisfies ReqDataSchema;

export const postSignin: Controller = (route) => {
    return (instance) => {
        instance.post(
            route,
            { schema: { ...dto, tags: [DOCS.tags.auth] } },
            async (req, res) => {
                const result = await userServices.getUserWithAuth({
                    identifier: { email: req.body.email },
                });
                if (!result) return res.status(404).send();
                if ('error' in result) return res.status(500).send();

                const { success } = await authServices.verifyHash({
                    value: req.body.password,
                    salt: result.auth?.credentials?.salt || '',
                    controlValue: result.auth?.credentials?.password || '',
                });

                if (!success) return res.status(401).send();

                const token = await authServices.buildToken({
                    subject: `${result.users.id}`,
                    payload: {
                        name: result.users.name,
                        email: result.auth?.credentials?.email || '',
                    },
                });

                return res
                    .setCookie(JWT_COOKIE_NAME, token, JWT_COOKIE_OPTIONS)
                    .send({ token });
            },
        );
    };
};
