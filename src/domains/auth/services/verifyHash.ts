import { hashString } from './hashString';

type VerifyHashArgs = { value: string; salt: string; controlValue: string };
export async function verifyHash({
    value,
    salt,
    controlValue,
}: VerifyHashArgs) {
    const { hash } = await hashString({ value, salt });

    return { success: hash === controlValue };
}
