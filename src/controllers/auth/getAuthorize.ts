import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import { env } from '@/infra/env';
import z from 'zod';
import { authServices } from '@/domains/auth';
import { DOCS } from '@/server/docs';

const dto = {
    querystring: z.object({
        client_id: z.string(),
        redirect_uri: z.string(),
        state: z.string(),
        scope: z.string(),
    }),
} satisfies ReqDataSchema;

export const getAuthorize: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            {
                schema: {
                    ...dto,
                    tags: [DOCS.tags.auth],
                },
            },
            async (req, res) => {
                const redirectUriValidation = z
                    .union([z.literal(env.BASE_URL), z.literal(env.APP_SCHEME)])
                    .safeParse(req.query.redirect_uri);
                const clientIdValidation = z
                    .union([z.literal('google')])
                    .safeParse(req.query.client_id);

                if (!redirectUriValidation.success)
                    return res
                        .status(400)
                        .send({ message: 'Invalid redirect_uri' });
                if (!clientIdValidation.success)
                    return res.status(400).send({ message: 'Invalid client' });

                const url = authServices.generateGoogleAuthUrl({
                    redirect_uri: redirectUriValidation.data,
                    state: req.query.state,
                    scope: req.query.scope,
                });

                return res.redirect(url);
            },
        );
    };
};
