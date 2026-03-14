import { validateEnvs } from '@/infra/env';
import { startServer } from '@/server';
import { runCleanAuthBlacklistJob } from '@/domains/authBlacklist';

const runRoutines = () => {
    runCleanAuthBlacklistJob();
};

export async function runApp() {
    await validateEnvs();
    await startServer();
    runRoutines();
}
