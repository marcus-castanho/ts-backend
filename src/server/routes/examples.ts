import { protectRoute, verifyPermission } from '@/domains/auth/guard';
import { Server } from '../types';
import {
    getCachedAllUserProducts,
    getCachedUsers,
} from '@/controllers/examples';

const PREFIX = '/examples';

export function setupExamplesRoutes(instance: Server) {
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

                instanceWitAuthPermission.register(
                    getCachedUsers('/cached/users'),
                );
                instanceWitAuthPermission.register(
                    getCachedAllUserProducts(
                        '/cached/users/:userId/products_1',
                    ),
                );
            });
        },
        { prefix: PREFIX },
    );
}
