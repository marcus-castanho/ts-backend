import * as jose from 'jose';
import { JWT_EXPIRATION_TIME } from '../config';
import { env } from '@/infra/env';
import { JWTPayload } from '../entity';

type BuildTokenArgs = {
    subject: string;
    payload?: Omit<JWTPayload, 'exp' | 'iat'>;
    expirationTime?: string;
};
export async function buildToken({
    subject,
    payload = {},
    expirationTime = JWT_EXPIRATION_TIME,
}: BuildTokenArgs) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const token = await new jose.SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expirationTime)
        .setSubject(subject)
        .setIssuedAt(issuedAt)
        .sign(new TextEncoder().encode(env.JWT_SECRET));

    return token;
}
