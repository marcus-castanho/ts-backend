import Fastify from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import fastifyCookie from '@fastify/cookie';
import FastifyVite from '@fastify/vite';
import { resolve } from 'node:path';
import { env } from '@/infra/env';
import fastifySwagger from '@fastify/swagger';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { DOCS_CONFIG, DOCS } from './docs';

export const createInstance = async () => {
    const server = await Fastify()
        .register(fastifySwagger, {
            openapi: DOCS_CONFIG,
            transform: jsonSchemaTransform,
        })
        .register(fastifySwaggerUi, { routePrefix: DOCS.route })
        .register(fastifyCookie)
        .register(FastifyVite, {
            root: resolve(__dirname, '../..'),
            distDir: resolve(__dirname, '../..', 'build'),
            dev: env.NODE_ENV === 'development',
            spa: true,
        })
        .withTypeProvider<ZodTypeProvider>();

    return server;
};
