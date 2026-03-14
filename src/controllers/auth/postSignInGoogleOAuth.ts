import z from 'zod';
import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import { env } from '@/infra/env';
import * as jose from 'jose';
import { buildToken } from '@/domains/auth/services/buildToken';
import {
    authServices,
    JWT_COOKIE_OPTIONS,
    JWT_COOKIE_NAME,
} from '@/domains/auth';
import { postToken as postGoogleAuthToken } from '@/services/oauth/google/routes/postToken';
import { log } from '@/infra/logger';
import { USER_MOCK, userServices } from '@/domains/users';
import { DOCS } from '@/server/docs';

const dto = { body: z.object({ code: z.string() }) } satisfies ReqDataSchema;

export const postSignInGoogleOAuth: Controller = (route) => {
    return (instance) => {
        instance.post(
            route,
            { schema: { ...dto, tags: [DOCS.tags.auth] } },
            async (req, res) => {
                const { code } = req.body;

                const authResponse = await postGoogleAuthToken({
                    client_id: env.GOOGLE_CLIENT_ID,
                    client_secret: env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: env.GOOGLE_REDIRECT_URI,
                    grant_type: 'authorization_code',
                    code: code,
                });

                if ('error' in authResponse) {
                    log.error(
                        `Google OAuth2 authentication error - Error: ${authResponse.error}`,
                    );
                    return res.status(500).send();
                }

                const { data, status } = authResponse;
                if (!data?.id_token || status === 400) {
                    return res.status(400).send({
                        message:
                            'Google OAuth2 authentication error. Missing parameters',
                    });
                }

                const decodedPayload = jose.decodeJwt(data.id_token);
                const validatedAuthJwtPayload =
                    authServices.validateGoogleIdJwtPayload(decodedPayload);
                if ('error' in validatedAuthJwtPayload) {
                    log.error(
                        `Google authentication info error - Error: ${validatedAuthJwtPayload.error}`,
                    );
                    return res.status(500).send();
                }

                const authJwtPayload = validatedAuthJwtPayload.data;
                const { name, email } = authJwtPayload;
                const result = await userServices.createIfNotExists({
                    payload: { ...USER_MOCK, email, name },
                });
                if (result && 'error' in result) return res.status(500).send();

                const token = await buildToken({
                    subject: `${result.user.id}`,
                    payload: { name: result.user.name, email },
                });

                return res
                    .setCookie(JWT_COOKIE_NAME, token, JWT_COOKIE_OPTIONS)
                    .send({
                        token,
                        new: result.new,
                    });
            },
        );
    };
};
