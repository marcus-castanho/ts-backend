import z from 'zod';

export const product_1Schema = z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    userId: z.number(),
});

export type Product_1 = z.infer<typeof product_1Schema>;
