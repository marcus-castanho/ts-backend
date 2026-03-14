import { env } from '@/infra/env';
import { host } from '@/infra/server';
import { FastifyCorsOptions } from '@fastify/cors';
import { FastifyListenOptions } from 'fastify';

type Config = FastifyListenOptions & { cors: FastifyCorsOptions };

const corsOptions: FastifyCorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
};

export const config: Config = {
    port: env.PORT,
    host,
    cors: corsOptions,
};
