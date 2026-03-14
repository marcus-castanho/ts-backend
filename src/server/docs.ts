import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

type SwaggerOptions = FastifyDynamicSwaggerOptions['openapi'];

const AUTH_TYPE = 'bearerAuth';

export const DOCS = {
    route: '/docs',
    authType: AUTH_TYPE,
    security: [{ [AUTH_TYPE]: [] }],
    tags: {
        users: 'users',
        auth: 'auth',
    },
};

export const DOCS_CONFIG: Partial<SwaggerOptions> = {
    info: {
        title: 'ts-backend API',
        description: 'API docs',
        version: '1.0.0',
    },
    tags: [{ name: DOCS.tags.users }, { name: 'auth' }],
    components: {
        securitySchemes: {
            [DOCS.authType]: { type: 'http', scheme: 'bearer' },
        },
        schemas: {
            cookies: {
                type: 'object',
                properties: {
                    token: { type: 'string' },
                },
            },
        },
    },
};
