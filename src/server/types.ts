import { FastifySchema } from 'fastify';
import { createInstance } from './instance';

export type Server = Awaited<ReturnType<typeof createInstance>>;
export type ReqDataSchema = Pick<
    FastifySchema,
    'params' | 'querystring' | 'body'
>;
export type InstanceHandler = (
    instance: Server,
    subRouteHandlers?: InstanceHandler[],
) => Server;
