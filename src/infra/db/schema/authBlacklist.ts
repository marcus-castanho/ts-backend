import { pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';
import { TableName } from '../types';
import { AUTH_BLACKLIST_MOCK } from '@/domains/authBlacklist';

const TABLE_NAME: TableName = 'auth_blacklist';

export const authBlacklistTable = pgTable(TABLE_NAME, {
    id: serial().primaryKey(),
    token: text().unique().notNull(),
    expiresAt: timestamp().defaultNow().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});

export type AuthBlacklistRecordDBRecord =
    typeof authBlacklistTable.$inferSelect;
export const typeSafeMockDBRecord: AuthBlacklistRecordDBRecord =
    AUTH_BLACKLIST_MOCK;
