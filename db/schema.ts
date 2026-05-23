import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const rsvps = pgTable("rsvps", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull(),
  attendees: integer().notNull().default(1),
  message: text().default(""),
  attending: boolean().notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
