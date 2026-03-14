import { Controller } from '../types';
import { authServices } from '@/domains/auth';
import { protectRoute } from '@/domains/auth/guard';
import { DOCS } from '@/server/docs';

export const getBiometricStatus: Controller = (route) => {
    return (instance) => {
        instance.get(
            route,
            {
                schema: { tags: [DOCS.tags.auth] },
                preHandler: protectRoute,
            },
            async (req, res) => {
                const userId = req['userId'];

                const result = await authServices.getBiometricStatus({
                    userId,
                });

                if ('error' in result) {
                    return res
                        .status(500)
                        .send({ error: result.error.message });
                }

                return res.send(result);
            },
        );
    };
};
