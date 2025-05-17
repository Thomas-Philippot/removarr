import { defineConfig } from "drizzle-kit";

const dbLocation = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : "file:config/db/db.sqlite3";

export default defineConfig({
  dialect: "sqlite",
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dbCredentials: {
    url: dbLocation,
  },
});
