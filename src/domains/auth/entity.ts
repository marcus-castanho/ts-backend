import z from 'zod';

export const authSchema = z.object({
    id: z.number(),
    credentials: z
        .object({ email: z.string(), password: z.string(), salt: z.string() })
        .nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.number(),
});

export type Auth = z.infer<typeof authSchema>;

export const jwtPayloadSchema = z.object({
    isAdmin: z.boolean().optional(),
    name: z.string(),
    email: z.string().optional(),
    sub: z.union([z.number(), z.string()]),
    exp: z.number(),
    iat: z.number(),
});
export type JWTPayload = z.infer<typeof jwtPayloadSchema> &
    Record<string, string | boolean | number>;
