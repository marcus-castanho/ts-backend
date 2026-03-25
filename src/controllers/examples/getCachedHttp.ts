import { Controller } from '../types';
import { DOCS } from '@/server/docs';

export const getCachedHttp: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            { schema: { tags: [DOCS.tags.examples] } },
            async (_, res) => {
                return res
                    .header('Cache-Control', 'public, max-age=60')
                    .send({ timestamp: new Date().toISOString() });
            },
        );
    };
};
