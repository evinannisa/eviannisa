import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  role: text('role').$type<'user' | 'bot'>().notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Time capsule: pesan pengunjung yang tersegel sampai openAt, lalu tampil di popup
export const capsules = pgTable('capsules', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  openAt: timestamp('open_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
