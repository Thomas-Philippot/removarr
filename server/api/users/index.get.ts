import { db } from "~/server/database";
import { user } from "~/server/database/schema";

export default defineEventHandler(async () => {
  return db.select().from(user).all();
});
