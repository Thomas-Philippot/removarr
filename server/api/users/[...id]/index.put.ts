import { db } from "~/server/database";
import { user } from "~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    await db.update(user).set(data).where(eq(user.id, data.id));
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
