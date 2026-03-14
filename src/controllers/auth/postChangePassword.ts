import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { authServices } from '@/domains/auth';
import { authBlacklistServices } from '@/domains/authBlacklist';
import { DOCS } from '@/server/docs';

const dto = {
    querystring: z.object({ token: z.string() }),
    body: z.object({ password: z.string() }),
} satisfies ReqDataSchema;

export const postChangePassword: Controller = (route) => {
    return (instance) => {
        instance.post(
            route,
            { schema: { ...dto, tags: [DOCS.tags.auth] } },
            async (req, res) => {
                const { token } = req.query;
                const { password } = req.body;
                const tokenValidation = await authServices.verifyToken(token);
                const blacklisted = await authBlacklistServices.getRecord({
                    token,
                });

                if (!tokenValidation.success || blacklisted)
                    return res.status(403).send();
                const { payload } = tokenValidation;
                const userId = parseInt(`${payload.sub}`);

                await authServices.updatedAuthCredentials({
                    userId: Number.isNaN(userId) ? -1 : userId,
                    password,
                });
                await authBlacklistServices.create({
                    payload: { token, expiresAt: new Date(payload.exp * 1000) },
                });

                return res.send();
            },
        );
    };
};
