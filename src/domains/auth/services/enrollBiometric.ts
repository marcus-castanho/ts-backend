import { db } from '@/infra/db';
import { biometricKeysTable } from '@/infra/db/schema/biometricKeys';
import { handleDBError } from '@/infra/db/error';
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

    if ('error' in result) throw handleDBError(result.error);

    const [record] = result;

    return record!;
}
