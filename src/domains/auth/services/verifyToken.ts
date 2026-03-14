import { env } from '@/infra/env';
import { jwtVerify } from 'jose';
import { JWTPayload, jwtPayloadSchema } from '../entity';

export async function verifyToken(
    token: string,
): Promise<{ success: true; payload: JWTPayload } | { success: false }> {
    const verified = await jwtVerify(
        token || '',
        new TextEncoder().encode(env.JWT_SECRET),
    ).catch(() => null);

    if (!verified) return { success: false };

    const parsedPayload = jwtPayloadSchema.safeParse(verified.payload);
    if (parsedPayload.error) return { success: false };

    return { success: true, payload: parsedPayload.data };
}
