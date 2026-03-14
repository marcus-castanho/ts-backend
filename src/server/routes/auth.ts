import { protectRoute, verifyIsAdmin } from '@/domains/auth/guard';
import { Server } from '../types';
import {
    getAuthorize,
    getCallback,
    getSignOut,
    postSignin,
    getSigninAdmin,
    postRecoverPassword,
    postChangePassword,
    postSignInGoogleOAuth,
    postEnrollBiometric,
    postSignInBiometric,
    getBiometricStatus,
    postCheckBiometric,
    getIsAdmin,
} from '@/controllers';

const PREFIX = '/auth';

export function setupAuthRoutes(instance: Server) {
    instance.register(
        (instanceWithPrefix) => {
            instanceWithPrefix.register(getAuthorize(`/authorize`));
            instanceWithPrefix.register(getCallback(`/callback`));
            instanceWithPrefix.register(getSignOut(`/signout`));
            instanceWithPrefix.register(postSignin(`/signin`));
            instanceWithPrefix.register(getSigninAdmin(`/signin_admin`));
            instanceWithPrefix.register(
                postRecoverPassword(`/recover_password`),
            );
            instanceWithPrefix.register(postChangePassword(`/change_password`));
            instanceWithPrefix.register(
                postSignInGoogleOAuth(`/signin/oauth/google`),
            );
            instanceWithPrefix.register(
                postEnrollBiometric(`/biometric/enroll`),
            );
            instanceWithPrefix.register(
                postSignInBiometric(`/signin/biometric`),
            );
            instanceWithPrefix.register(
                getBiometricStatus(`/biometric/status`),
            );
            instanceWithPrefix.register(postCheckBiometric(`/biometric/check`));

            instanceWithPrefix.register((instanceWitAuthPermission) => {
                instanceWitAuthPermission.addHook('onRequest', protectRoute);
                instanceWitAuthPermission.addHook('preHandler', verifyIsAdmin);

                instanceWitAuthPermission.register(getIsAdmin(`/is_admin`));
            });
        },
        { prefix: PREFIX },
    );
}
