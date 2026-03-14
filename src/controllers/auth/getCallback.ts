import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import { env } from '@/infra/env';
import z from 'zod';
import { DOCS } from '@/server/docs';

const dto = {
    querystring: z.object({ state: z.string(), code: z.string() }),
} satisfies ReqDataSchema;

export const getCallback: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            { schema: { ...dto, tags: [DOCS.tags.auth] } },
            async (req, res) => {
                const combinedPlatformAndState = req.query.state;
                const platform = combinedPlatformAndState.split('|')[0] || '';
                const state = combinedPlatformAndState.split('|')[1] || '';

                const params = new URLSearchParams({
                    code: req.query.code,
                    state,
                });
                const origin =
                    platform === 'web' ? env.BASE_URL : env.APP_SCHEME;
                const url = `${origin}?${params.toString()}`;

                return res.redirect(url);
            },
        );
    };
};
