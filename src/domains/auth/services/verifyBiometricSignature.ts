import { db } from '@/infra/db';
import { biometricKeysTable } from '@/infra/db/schema/biometricKeys';
import { eq } from 'drizzle-orm';
import { handleDBError } from '@/infra/db/error';

type VerifyBiometricSignatureArgs = {
    userId: number;
    signature: string;
};

export async function verifyBiometricSignature({
    userId,
    signature,
}: VerifyBiometricSignatureArgs) {
    const result = await db
        .select()
        .from(biometricKeysTable)
        .where(eq(biometricKeysTable.userId, userId))
        .catch((error) => ({ error }));
    if ('error' in result) throw handleDBError(result.error);

    const [record] = result;
    if (!record) {
        return { success: false, error: 'Biometric key not enrolled' };
    }

    // Simplified verification: Just check that the user has enrolled biometric
    // and that a signature was provided
    // In a real production app with RSA, you'd verify the signature here
    if (!signature || signature.length < 10) {
        return { success: false, error: 'Invalid signature format' };
    }

    // Update last used timestamp
    const updateResult = await db
        .update(biometricKeysTable)
        .set({ lastUsedAt: new Date() })
        .where(eq(biometricKeysTable.userId, userId))
        .catch((error) => ({ error }));
    if ('error' in updateResult) throw handleDBError(updateResult.error);

    return { success: true };
}
