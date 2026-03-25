import { protectRoute, verifyPermission } from '@/domains/auth/guard';
import { InstanceHandler } from '../types';
import {
    getCachedAllUserProducts,
    getCachedHttp,
    getCachedUsers,
} from '@/controllers/examples';

const PREFIX = '/examples';

export const setupExamplesRoutes: InstanceHandler = (instance) => {
    instance.register(
        (instanceWithPrefix) => {
            /**
             * DOCS - CACHING: req with browser HTTP caching
             * - The returned value is dynamically based on the current timestamp and cached for 60 seconds
             * - To test it, access the route on the browser and then access the same route on different tabs to see the persisted value
             */
            instanceWithPrefix.register(getCachedHttp('/cached/http'));

            instanceWithPrefix.register((instanceWitAuthPermission) => {
                instanceWitAuthPermission.addHook('onRequest', protectRoute);
                instanceWitAuthPermission.addHook(
                    'preHandler',
                    verifyPermission,
                );

                instanceWitAuthPermission.get('/', () => {
                    return { ok: true };
                });

                /**
                 * DOCS - CACHING: req with simple cache-aside
                 */
                instanceWitAuthPermission.register(
                    getCachedUsers('/cached/users'),
                );
                /**
                 * DOCS - CACHING: - req with hybrid caching strategy: write-through and cache-aside
                 * - The routes POST /products_1, PATCH /products_1/:id and DELETE /products_1/:id update both primary DB and cache data for all products associated with a user
                 * - This route queries all products associated with a user and implements cache-aside to also update cache data when there is none
                 */
                instanceWitAuthPermission.register(
                    getCachedAllUserProducts(
                        '/cached/users/:userId/products_1',
                    ),
                );
            });
        },
        { prefix: PREFIX },
    );

    return instance;
};
