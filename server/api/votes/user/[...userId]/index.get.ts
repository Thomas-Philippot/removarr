import { db } from "~/server/database";
import { vote } from "~/server/database/schema";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.userId;
  const query = getQuery(event);
  const mediaType = query.mediaType;

  if (userId) {
    if (mediaType) {
      return db
        .select()
        .from(vote)
        .where(and(eq(vote.userId, userId), eq(vote.mediaType, mediaType)));
    }
    return db.select().from(vote).where(eq(vote.userId, userId));
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Missing userId query parameter",
  });
});
