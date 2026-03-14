import { Controller } from '../types';
import { ReqDataSchema } from '@/server/types';
import z from 'zod';
import { authServices } from '@/domains/auth';
import { protectRoute } from '@/domains/auth/guard';
import { DOCS } from '@/server/docs';

const dto = {
    body: z.object({
        userId: z.number(),
        publicKey: z.string(),
        deviceInfo: z
            .object({
                deviceId: z.string().optional(),
                deviceName: z.string().optional(),
                platform: z.string().optional(),
            })
            .optional(),
    }),
} satisfies ReqDataSchema;

export const postEnrollBiometric: Controller = (route) => {
    return (instance) => {
        instance.post(
            route,
            {
                schema: { ...dto, tags: [DOCS.tags.auth] },
                preHandler: protectRoute,
            },
            async (req, res) => {
                const authenticatedUserId = req['userId'];

                if (authenticatedUserId !== req.body.userId) {
                    return res.status(403).send({
                        error: 'You can only enroll your own biometric data',
                    });
                }

                await authServices.enrollBiometric({
                    userId: req.body.userId,
                    publicKey: req.body.publicKey,
                    deviceInfo: req.body.deviceInfo,
                });

                return res.send({ enrolled: true });
            },
        );
    };
};
