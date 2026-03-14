import { db } from '@/infra/db';
import { biometricKeysTable } from '@/infra/db/schema/biometricKeys';
import { log } from '@/infra/logger';
import { catchError } from '@/infra/db/error';
import * as crypto from 'crypto';

type EnrollBiometricArgs = {
    userId: number;
    publicKey: string;
    deviceInfo?: {
        deviceId?: string;
        deviceName?: string;
        platform?: string;
    };
};

export async function enrollBiometric({
    userId,
    publicKey,
    deviceInfo,
}: EnrollBiometricArgs) {
    // Generate a random challenge for signature verification
    const challenge = crypto.randomBytes(32).toString('base64');

    const result = await db
        .insert(biometricKeysTable)
        .values({
            userId,
            publicKey,
            challenge,
            deviceInfo,
        })
        .onConflictDoUpdate({
            target: biometricKeysTable.userId,
            set: {
                publicKey,
                challenge,
                deviceInfo,
                enrolledAt: new Date(),
            },
        })
        .returning()
        .catch((error) => ({ error }));

    if ('error' in result) return catchError(result.error);

    const [record] = result;
    if (!record) {
        log.error('Failed to enroll biometric - no record returned');
        return { error: { code: '-1', message: 'Enrollment failed' } };
    }

    return { success: true, record };
}
