import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { userServices } from '@/domains/users';
import { authServices } from '@/domains/auth';
import { DOCS } from '@/server/docs';

const dto = {
    body: z.object({
        email: z.string().email(),
    }),
} satisfies ReqDataSchema;

export const postCheckBiometric: Controller = (route) => {
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

                // Check biometric status
                const biometricResult = await authServices.getBiometricStatus({
                    userId,
                });

                if ('error' in biometricResult) {
                    return res
                        .status(500)
                        .send({ error: biometricResult.error.message });
                }

                return res.send({
                    enrolled: biometricResult.enrolled,
                    challenge: biometricResult.enrolled
                        ? biometricResult.challenge
                        : undefined,
                });
            },
        );
    };
};
