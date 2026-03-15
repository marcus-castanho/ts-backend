import { validateEnvs } from '@/infra/env';
import { startServer } from '@/server';
import { runCleanAuthBlacklistJob } from '@/domains/authBlacklist';
import { client as cacheClient } from './infra/cache/client';

const runRoutines = () => {
    runCleanAuthBlacklistJob();
};

export async function runApp() {
    await validateEnvs();
    await startServer();
    await cacheClient.connect();
    runRoutines();
}
