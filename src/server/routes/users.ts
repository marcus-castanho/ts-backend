import { protectRoute, verifyPermission } from '@/domains/auth/guard';
import { Server } from '../types';
import {
    postUsers,
    getUsers,
    getUser,
    patchUser,
    deleteUser,
} from '@/controllers/users';

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
                instanceWitAuthPermission.register(getUser(`/:id`));
                instanceWitAuthPermission.register(patchUser(`/:id`));
                instanceWitAuthPermission.register(deleteUser(`/:id`));
            });
        },
        { prefix: PREFIX },
    );
}
