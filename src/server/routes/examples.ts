import { protectRoute, verifyPermission } from '@/domains/auth/guard';
import { InstanceHandler } from '../types';
import {
    getCachedAllUserProducts,
    getCachedUsers,
} from '@/controllers/examples';

const PREFIX = '/examples';

export const setupExamplesRoutes: InstanceHandler = (instance) => {
    instance.register(
        (instanceWithPrefix) => {
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
                 * DOCS - req with simple cache-aside
                 */
                instanceWitAuthPermission.register(
                    getCachedUsers('/cached/users'),
                );
                /**
                 * DOCS - req with hybrid caching strategy: write-through and cache-aside
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
