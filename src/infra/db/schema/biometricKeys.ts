import {
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    json,
} from 'drizzle-orm/pg-core';
import { TableName } from '../types';
import { usersTable } from './users';

const TABLE_NAME: TableName = 'biometric_keys';

export const biometricKeysTable = pgTable(TABLE_NAME, {
    id: serial().primaryKey(),
    userId: integer('user_id')
        .references(() => usersTable.id)
        .notNull()
        .unique(),
    publicKey: text('public_key').notNull(),
    challenge: text().notNull(),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
    lastUsedAt: timestamp('last_used_at'),
    deviceInfo: json('device_info').$type<{
        deviceId?: string;
        deviceName?: string;
        platform?: string;
    }>(),
});

export type BiometricKeyDBRecord = typeof biometricKeysTable.$inferSelect;
