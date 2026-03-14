import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { userServices } from '@/domains/users';
import {
    authServices,
    JWT_COOKIE_NAME,
    JWT_COOKIE_OPTIONS,
} from '@/domains/auth';
import { DOCS } from '@/server/docs';

const dto = {
    body: z.object({
        email: z.string(),
        biometricSignature: z.string(),
    }),
} satisfies ReqDataSchema;

export const postSignInBiometric: Controller = (route) => {
    return (instance) => {
        instance.post(
            route,
            { schema: { ...dto, tags: [DOCS.tags.auth] } },
            async (req, res) => {
                // Look up user by email
                const result = await userServices.getUserWithAuth({
                    identifier: { email: req.body.email },
                });

                if (!result)
                    return res.status(404).send({ error: 'User not found' });
                if ('error' in result)
                    return res
                        .status(500)
                        .send({ error: result.error.message });

                const userId = result.users.id;

                // Verify biometric signature
                const verificationResult =
                    await authServices.verifyBiometricSignature({
                        userId,
                        signature: req.body.biometricSignature,
                    });

                if (
                    'error' in verificationResult &&
                    typeof verificationResult.error === 'object'
                ) {
                    return res.status(500).send({
                        error: verificationResult.error.message,
                    });
                }

                if (!verificationResult.success) {
                    return res.status(401).send({
                        error:
                            typeof verificationResult.error === 'string'
                                ? verificationResult.error
                                : 'Authentication failed',
                    });
                }

                // Generate JWT token using existing buildToken service
                const token = await authServices.buildToken({
                    subject: `${userId}`,
                    payload: {
                        name: result.users.name,
                        email: result.auth?.credentials?.email || '',
                    },
                });

                return res
                    .setCookie(JWT_COOKIE_NAME, token, JWT_COOKIE_OPTIONS)
                    .send({ token });
            },
        );
    };
};
