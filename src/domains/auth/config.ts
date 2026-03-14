import { CookieSerializeOptions } from '@fastify/cookie';

export const JWT_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
export const JWT_COOKIE_OPTIONS: CookieSerializeOptions = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: true,
    maxAge: JWT_COOKIE_MAX_AGE,
};
export const JWT_COOKIE_NAME = 'token';
export const JWT_EXPIRATION_TIME = '30d';
