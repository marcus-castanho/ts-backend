import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

type SwaggerOptions = FastifyDynamicSwaggerOptions['openapi'];

const AUTH_TYPE = 'bearerAuth';
const ADMIN_AUTH_TYPE = 'apiKey';

export const DOCS = {
    route: '/docs',
    authType: AUTH_TYPE,
    adminAuthType: ADMIN_AUTH_TYPE,
    security: [{ [AUTH_TYPE]: [] }],
    tags: {
        users: 'users',
        auth: 'auth',
        products_1: 'products_1',
        examples: 'examples',
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
            apiKey: {
                type: ADMIN_AUTH_TYPE,
                name: 'api-key',
                in: 'header',
            },
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
