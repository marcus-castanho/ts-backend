import 'dotenv/config';
import { log } from '@/infra/logger';
import { runApp } from './app';
import { db } from './infra/db/client';
import { client as cacheClient } from './infra/cache/client';

(function bootstrap() {
    runApp()
        .then(() => log.info('Application is running'))
        .catch((error) => {
            const errorMessage = error?.message || '';
            log.fatal(`Failed to start the app. Error: ${errorMessage}`);
            process.exit(1);
        });
})();

process.on('SIGTERM', () => {
    log.info('SIGTERM signal received.');
    db.$client.end();
    cacheClient.close();
    process.exit(1);
});

process.on('SIGINT', () => {
    log.info('SIGTERM signal received.');
    db.$client.end();
    cacheClient.close();
    process.exit(1);
});
