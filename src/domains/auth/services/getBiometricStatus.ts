import { db } from '@/infra/db';
import { biometricKeysTable } from '@/infra/db/schema/biometricKeys';
import { eq } from 'drizzle-orm';
import { catchError } from '@/infra/db/error';

type GetBiometricStatusArgs = {
    userId: number;
};

export async function getBiometricStatus({ userId }: GetBiometricStatusArgs) {
    const result = await db
        .select({
            enrolled: biometricKeysTable.enrolledAt,
            challenge: biometricKeysTable.challenge,
            deviceInfo: biometricKeysTable.deviceInfo,
        })
        .from(biometricKeysTable)
        .where(eq(biometricKeysTable.userId, userId))
        .catch((error) => ({ error }));

    if ('error' in result) return catchError(result.error);

    const [record] = result;

    if (!record) {
        return { enrolled: false };
    }

    return {
        enrolled: true,
        challenge: record.challenge,
        deviceInfo: record.deviceInfo,
    };
}
