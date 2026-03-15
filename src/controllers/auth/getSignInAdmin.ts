import { JWT_COOKIE_NAME, JWT_COOKIE_OPTIONS } from '@/domains/auth';
import { Controller } from '../types';
import { buildToken } from '@/domains/auth/services/buildToken';
import { env } from '@/infra/env';
import { DOCS } from '@/server/docs';

export const getSigninAdmin: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            {
                schema: {
                    tags: [DOCS.tags.auth],
                    security: [{ [DOCS.adminAuthType]: [] }],
                },
            },
            async (req, res) => {
                const apiKey = req.headers['api-key'];
                if (apiKey !== env.ADMIN_API_KEY) return res.status(401).send();

                const token = await buildToken({
                    subject: `admin`,
                    payload: { isAdmin: true, name: 'admin' },
                    expirationTime: '1h',
                });

                return res
                    .setCookie(JWT_COOKIE_NAME, token, JWT_COOKIE_OPTIONS)
                    .send({ token });
            },
        );
    };
};
