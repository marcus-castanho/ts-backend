import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { TableName } from '../types';
import { USER_MOCK } from '@/domains/users/mock';
import { relations } from 'drizzle-orm';
import { authTable } from './auth';

const TABLE_NAME: TableName = 'users';

export const usersTable = pgTable(TABLE_NAME, {
    id: serial().primaryKey(),
    name: text().default('').notNull(),
    email: text().unique().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});

export type UserDBRecord = typeof usersTable.$inferSelect;
export const typesadeMockDBRecord: UserDBRecord = USER_MOCK;

export const authRelations = relations(usersTable, ({ one }) => ({
    auth: one(authTable),
}));
