import { db } from "~/server/database";
import { user } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const results = await db.insert(user).values(data).returning();
    return results[0];
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
