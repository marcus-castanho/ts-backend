import crypto from 'node:crypto';

export function generateQueryHashKey(
    filter: Record<string, string | number | boolean>,
) {
    const text = JSON.stringify(filter);
    const key = crypto.createHash('sha256').update(text).digest('hex');

    return key;
}
