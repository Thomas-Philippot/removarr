import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbLocation = process.env.DATABASE_URL
  ? process.env.DATABASE_URL
  : "config/db/db.sqlite3";

// Create the 'config/db' folder if it doesn't exist
const dbFolder = path.dirname(dbLocation);
if (!fs.existsSync(dbFolder)) {
  fs.mkdirSync(dbFolder, { recursive: true });
}

export const sqlite = new Database(dbLocation);
export const db: BetterSQLite3Database = drizzle(sqlite);

export const runMigration = () => {
  migrate(db, {
    migrationsFolder: "server/database/migrations",
  });
};
