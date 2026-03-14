import { integer, pgTable, serial, timestamp, json } from 'drizzle-orm/pg-core';
import { TableName } from '../types';
import { AUTH_MOCK } from '@/domains/auth';
import { usersTable } from './users';

const TABLE_NAME: TableName = 'auth';

export const authTable = pgTable(TABLE_NAME, {
    id: serial().primaryKey(),
    credentials: json().$type<{
        email: string;
        password: string;
        salt: string;
    }>(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
    userId: integer('user_id').references(() => usersTable.id),
});

export type AuthDBRecord = typeof authTable.$inferSelect;
export const typeSafeMockDBRecord: AuthDBRecord = AUTH_MOCK;
