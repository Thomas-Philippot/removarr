import { sql } from "drizzle-orm";
import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar").notNull(),
  role: text("role").default("user"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const vote = sqliteTable(
  "vote",
  {
    mediaId: text("media_id").notNull(),
    userId: text("user_id").notNull(),
    mediaType: text("media_type"),
  },
  (table) => [primaryKey({ columns: [table.mediaId, table.userId] })],
);
