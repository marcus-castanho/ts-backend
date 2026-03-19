import { log } from '@/infra/logger';
import cors from '@fastify/cors';
import { config } from './config';
import { Server } from './types';
import { setupUsersRoutes } from './routes/users';
import {
    serializerCompiler,
    validatorCompiler,
} from 'fastify-type-provider-zod';
import { createInstance } from './instance';
import { setupAuthRoutes } from './routes/auth';
import { env } from '@/infra/env';
import { logDebugRequest } from './lib/logDebugRequest';
import { logDebugResponse } from './lib/logDebugResponse';
import { setupExamplesRoutes } from './routes/examples';
import { setupProducts_1Routes } from './routes/products_1';

export async function startServer() {
    const server = await createInstance();
    setupConfig(server);
    setupLogs(server);
    setupRoutes(server);
    await setupClient(server);

    return server
        .listen({ host: config.host, port: config.port })
        .then((host) => log.info(`Server listening at ${host}`))
        .catch((error) => {
            log.error(`Failed to start server. Error: ${error?.message || ''}`);
            throw new Error(`Failed to start server.`);
        });
}

function setupConfig(instance: Server) {
    instance.register(cors, config.cors);
    instance.setValidatorCompiler(validatorCompiler);
    instance.setSerializerCompiler(serializerCompiler);
}

function setupLogs(instance: Server) {
    if (env.NODE_ENV === 'development') {
        logDebugRequest(instance);
        logDebugResponse(instance);
        return;
    }

    instance.addHook('onRequest', (req, res, done) => {
        log.info(`Incoming request: ${req.method} ${req.url}`);
        return done();
    });
    instance.addHook('onResponse', (req, res, done) => {
        log.info(`Response: ${res.statusCode} ${req.method} ${req.url}`);
        return done();
    });
}

function setupRoutes(instance: Server) {
    instance.get('/', (_, res) => res.send({ message: 'Server is running' }));

    setupUsersRoutes(instance, [setupProducts_1Routes]);
    setupAuthRoutes(instance);
    setupExamplesRoutes(instance);
}

async function setupClient(instance: Server) {
    instance.get('/client', (_, reply) => reply.html());
    await instance.vite.ready();
}
