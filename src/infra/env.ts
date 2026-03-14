import { log } from '@/infra/logger';
import z from 'zod';

const envSchema = z.object({
    NODE_ENV: z.string(),
    PORT: z.coerce.number(),
    BASE_URL: z.string(),
    APP_SCHEME: z.string(),
    DATABASE_URL: z.string(),
    RENDER: z.string().optional(),
    ADMIN_API_KEY: z.string(),
    JWT_SECRET: z.string(),
    MAIL_USER: z.string(),
    MAIL_PASSWORD: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GOOGLE_AUTH_URL: z.string(),
    GOOGLE_REDIRECT_URI: z.string(),
    GOOGLE_AUTH_ACCOUNT_URL: z.string(),
});

const envValidation = envSchema.safeParse(process.env);
if (!envValidation.success) {
    const errorMessage = envValidation.error?.message || '';
    log.fatal(`Failed to load env vars. Error: ${errorMessage}`);
    process.exit(1);
}
export const env = envValidation.data;

export async function validateEnvs() {
    const validation = await envSchema
        .safeParseAsync(process.env)
        .catch((error) => {
            log.error(
                `Failed to load env vars. Error: ${error?.message || ''}`,
            );
            throw new Error(`Failed to load env vars.`);
        });

    if (validation.error) {
        log.error(
            `Failed to load env vars. Error: ${validation.error?.message || ''}`,
        );
        throw new Error(`Failed to load env vars.`);
    }

    return validation.data;
}
