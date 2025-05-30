import { db } from "~/server/database";
import { vote } from "~/server/database/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.userId;

  if (userId) {
    return db.select().from(vote).where(eq(vote.userId, userId));
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Missing userId query parameter",
  });
});
