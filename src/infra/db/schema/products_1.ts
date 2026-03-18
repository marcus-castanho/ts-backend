import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { TableName } from '../types';
import { PRODUCT_1_MOCK } from '@/domains/products_1/mock';
import { usersTable } from './users';

const TABLE_NAME: TableName = 'products_1';

export const products_1Table = pgTable(TABLE_NAME, {
    id: serial().primaryKey(),
    name: text().default('').notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    userId: integer('user_id').references(() => usersTable.id),
});

export type Product_1DBRecord = typeof products_1Table.$inferSelect;
export const typesadeMockDBRecord: Product_1DBRecord = PRODUCT_1_MOCK;
