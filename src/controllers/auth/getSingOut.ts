import { JWT_COOKIE_NAME } from '@/domains/auth';
import { Controller } from '../types';
import { DOCS } from '@/server/docs';

export const getSignOut: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            { schema: { tags: [DOCS.tags.auth] } },
            async (_, res) => {
                return res.clearCookie(JWT_COOKIE_NAME).send();
            },
        );
    };
};
