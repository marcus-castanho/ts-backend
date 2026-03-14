import { log } from '@/infra/logger';
import { Server } from '../types';

export function logDebugRequest(instance: Server) {
    instance.addHook('preHandler', (req, res, done) => {
        log.info({
            type: 'REQUEST',
            method: req.method,
            url: req.url,
        });
        return done();
    });
}
