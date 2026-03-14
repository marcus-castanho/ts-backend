import { randomBytes, pbkdf2Sync } from 'crypto';

type HashStringArgs = { value: string; salt?: string };
export async function hashString(options: HashStringArgs) {
    const generatedSalt = await new Promise<string>((resolve) =>
        resolve(randomBytes(32).toString('hex')),
    );
    const salt = options.salt || generatedSalt;
    const hash = await new Promise<string>((resolve) =>
        resolve(
            pbkdf2Sync(options.value, salt, 10000, 64, 'sha512').toString(
                'hex',
            ),
        ),
    );

    return { salt, hash };
}
