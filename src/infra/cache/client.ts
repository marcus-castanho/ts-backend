import { createClient } from 'redis';
import { env } from '../env';

export const client = createClient({
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST,
        port: 10469,
    },
});
