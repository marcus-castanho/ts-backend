import z from 'zod';

const jwtPayloadSchema = z
    .object({
        /**
         * Non used fields - optional validation
         */
        iss: z.string(),
        azp: z.string(),
        aud: z.string(),
        at_hash: z.string(),
        picture: z.string(),
        given_name: z.string(),
        family_name: z.string(),
        email_verified: z.boolean(),
        iat: z.number(),
        exp: z.number(),
    })
    .partial()
    .extend({
        /**
         * Required fields
         */
        sub: z.string(),
        name: z.string(),
        email: z.string(),
    });

export function validateGoogleIdJwtPayload(payload: unknown) {
    const validation = jwtPayloadSchema.safeParse(payload);
    const { success, error } = validation;

    if (!success) return { error };

    return { data: validation.data };
}
