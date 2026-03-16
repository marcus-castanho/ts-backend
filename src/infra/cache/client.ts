import { createClient } from 'redis';
import { env } from '../env';
import { log } from '../logger';

export const client = createClient({
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST,
        port: 10469,
    },
}).on('error', (err) => log.error('Redis Client Error', err));
