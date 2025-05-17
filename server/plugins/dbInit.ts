import { runMigration } from "~/server/database";

export default defineNitroPlugin(() => {
  runMigration();
});
