import {
  pgTable,
  timestamp,
  boolean,
  uuid,
  varchar,
  text,
  index,
} from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: uuid().primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: varchar({ length: 500 }).notNull(),
  subtitle: varchar({ length: 500 }),
  description: varchar({ length: 1000 }),
  completed: boolean().default(false),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    // Index for fetching todos by userId (most common query)
    userIdIdx: index('todos_user_id_idx').on(table.userId),
    // Composite index for filtering by user and sorting by date
    userIdCreatedAtIdx: index('todos_user_id_created_at_idx').on(table.userId, table.createdAt),
    // Index for filtering by completion status
    completedIdx: index('todos_completed_idx').on(table.completed),
  };
});

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
}, (table) => {
  return {
    // Index for session lookups by userId
    userIdIdx: index('session_user_id_idx').on(table.userId),
    // Index for session expiration checks
    expiresAtIdx: index('session_expires_at_idx').on(table.expiresAt),
  };
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
}, (table) => {
  return {
    // Index for account lookups by userId
    userIdIdx: index('account_user_id_idx').on(table.userId),
    // Composite index for provider login lookups
    providerAccountIdx: index('account_provider_account_idx').on(table.providerId, table.accountId),
  };
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});
