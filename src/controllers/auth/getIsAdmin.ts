import { DOCS } from '@/server/docs';
import { Controller } from '../types';

export const getIsAdmin: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            { schema: { tags: [DOCS.tags.auth] } },
            async () => {
                return;
            },
        );
    };
};
