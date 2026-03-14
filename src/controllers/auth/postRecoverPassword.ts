import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { authServices } from '@/domains/auth';
import { userServices } from '@/domains/users';
import { client } from '@/services/mail/client';
import { log } from '@/infra/logger';
import { DOCS } from '@/server/docs';

const dto = {
    body: z.object({ email: z.string() }),
} satisfies ReqDataSchema;

export const postRecoverPassword: Controller = (route) => {
    return (instance) => {
        instance.post(
            route,
            { schema: { ...dto, tags: [DOCS.tags.auth] } },
            async (req, res) => {
                const { email } = req.body;
                const result = await userServices.getUserWithAuth({
                    identifier: { email },
                });

                if (!result || 'error' in result) return res.status(404).send();

                const token = await authServices.buildToken({
                    subject: `${result.users.id}`,
                    payload: { name: result.users.name },
                    expirationTime: '30min',
                });

                client
                    .sendMail({
                        from: '"Developer" <developer@test.com>',
                        to: email,
                        subject: 'Password recovery',
                        html: `
                    <p style=''>Please recover your password with the following token: ${token}. Use /auth/change_passowrd route</p>
                `,
                    })
                    .catch((error) => {
                        log.error(
                            `Error sending recover password email. Error: ${error}`,
                        );
                    });

                return res.send();
            },
        );
    };
};
