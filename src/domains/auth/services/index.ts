import { buildToken } from './buildToken';
import { createAuthCredentials } from './createAuthCredentials';
import { hashString } from './hashString';
import { verifyHash } from './verifyHash';
import { verifyToken } from './verifyToken';
import { updatedAuthCredentials } from './updateAuthCredentials';
import { generateGoogleAuthUrl } from './generateGoogleAuthUrl';
import { validateGoogleIdJwtPayload } from './validateGoogleIdJwtPayload';
import { enrollBiometric } from './enrollBiometric';
import { verifyBiometricSignature } from './verifyBiometricSignature';
import { getBiometricStatus } from './getBiometricStatus';

export const authServices = {
    buildToken,
    createAuthCredentials,
    hashString,
    verifyHash,
    verifyToken,
    updatedAuthCredentials,
    generateGoogleAuthUrl,
    validateGoogleIdJwtPayload,
    enrollBiometric,
    verifyBiometricSignature,
    getBiometricStatus,
};
