import { protectRoute, verifyPermission } from '@/domains/auth/guard';
import { InstanceHandler } from '../types';
import {
    postUsers,
    getUsers,
    getUser,
    patchUser,
    deleteUser,
} from '@/controllers/users';

const PREFIX = '/users';

export const setupUsersRoutes: InstanceHandler = (
    instance,
    subRoutesRegisters = [],
) => {
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

                subRoutesRegisters.map((handler) => {
                    instanceWitAuthPermission.register(
                        (instanceWithIdParamPrefix) => {
                            handler(instanceWithIdParamPrefix);
                        },
                        { prefix: '/:userId' },
                    );
                });
            });
        },
        { prefix: PREFIX },
    );

    return instance;
};
