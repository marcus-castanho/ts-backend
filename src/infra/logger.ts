import pino from 'pino';

//@ts-expect-error: Client side typing not configured on this level. Used only to define logger config.
const isClientSide = typeof window === 'undefined' ? false : true;

/**
 * Use pino-pretty identifier string in pino target prop as stated in the docs: https://github.com/pinojs/pino-pretty?tab=readme-ov-file#usage
 */
export const LOG_PRETTIER = 'pino-pretty';

const logger = pino({
    transport: {
        target: LOG_PRETTIER,
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: false,
            messageFormat: '{msg}',
        },
    },
    level: isClientSide
        ? 'info'
        : process?.env['NODE_ENV'] === 'development'
          ? 'debug'
          : 'info',
});

export const log = logger;
