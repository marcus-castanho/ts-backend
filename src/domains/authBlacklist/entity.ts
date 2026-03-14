import z from 'zod';

export const authBlacklistRecordSchema = z.object({
    id: z.number(),
    token: z.string(),
    expiresAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type AuthBlackListRecord = z.infer<typeof authBlacklistRecordSchema>;
