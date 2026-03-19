import { protectRoute, verifyPermission } from '@/domains/auth/guard';
import { Server } from '../../types';
import {
    postUsers,
    getUsers,
    getUser,
    patchUser,
    deleteUser,
} from '@/controllers/users';
import { setupProducts_1Routes } from './products_1';

const PREFIX = '/users';

export function setupUsersRoutes(instance: Server) {
    instance.register(
        (instanceWithPrefix) => {
            instanceWithPrefix.register(postUsers('/'));

            instanceWithPrefix.register((instanceWitAuthPermission) => {
                instanceWitAuthPermission.addHook('onRequest', protectRoute);
                instanceWitAuthPermission.addHook(
                    'preHandler',
                    verifyPermission,
                );

                instanceWitAuthPermission.register(getUsers('/'));
                instanceWitAuthPermission.register(getUser(`/:userId`));
                instanceWitAuthPermission.register(patchUser(`/:userId`));
                instanceWitAuthPermission.register(deleteUser(`/:userId`));

                instanceWitAuthPermission.register(
                    (instanceWithIdParamPrefix) => {
                        setupProducts_1Routes(instanceWithIdParamPrefix);
                    },
                    { prefix: '/:userId' },
                );
            });
        },
        { prefix: PREFIX },
    );
}
