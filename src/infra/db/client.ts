import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import { log } from '../logger';

if (!env.DATABASE_URL) {
    log.fatal(`Failed to load DB connection URL vars`);
    process.exit(1);
}
const client = postgres(env.DATABASE_URL, { prepare: false, ssl: 'require' });
export const db = drizzle({ client });
