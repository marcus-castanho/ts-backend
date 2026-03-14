import { log } from '@/infra/logger';
import cron from 'node-cron';
import { authBlacklistServices } from '../services';

export const runCleanAuthBlacklistJob = () =>
    cron.schedule('0 3 * * *', () => {
        log.info('Running clean auth black list task every day at 3 AM');
        authBlacklistServices.deleteMany({ date: new Date() }).catch(() => {});
    });
