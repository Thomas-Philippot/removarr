import { db } from "~/server/database";
import { vote } from "~/server/database/schema";

export default defineEventHandler(() => {
  return db.select().from(vote).all();
});
