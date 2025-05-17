import { db } from "~/server/database";
import { user } from "~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id as string;
    return db.select().from(user).where(eq(user.id, id)).get();
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
