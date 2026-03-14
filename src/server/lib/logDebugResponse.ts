import { log } from '@/infra/logger';
import { Server } from '../types';

export function logDebugResponse(instance: Server) {
    instance.addHook('onResponse', (req, res, done) => {
        const responseTime = res.elapsedTime
            ? `${res.elapsedTime.toFixed(2)}ms`
            : 'N/A';

        log.info({
            type: 'RESPONSE',
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime,
        });
        return done();
    });
}
