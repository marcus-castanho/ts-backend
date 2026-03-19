import { protectRoute, verifyPermission } from '@/domains/auth/guard';
import { Server } from '../../types';
import {
    deleteProduct_1,
    getProduct_1,
    getProducts_1,
    patchProduct_1,
    postProduct_1,
} from '@/controllers/products_1';

const PREFIX = '/products_1';

export function setupProducts_1Routes(instance: Server) {
    instance.register(
        (instanceWithPrefix) => {
            instanceWithPrefix.register((instanceWitAuthPermission) => {
                instanceWitAuthPermission.addHook('onRequest', protectRoute);
                instanceWitAuthPermission.addHook(
                    'preHandler',
                    verifyPermission,
                );

                instanceWithPrefix.register(postProduct_1('/'));
                instanceWitAuthPermission.register(getProducts_1('/'));
                instanceWitAuthPermission.register(getProduct_1(`/:id`));
                instanceWitAuthPermission.register(patchProduct_1(`/:id`));
                instanceWitAuthPermission.register(deleteProduct_1(`/:id`));
            });
        },
        { prefix: PREFIX },
    );
}
