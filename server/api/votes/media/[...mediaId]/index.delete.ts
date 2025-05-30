import { db } from "~/server/database";
import { vote } from "~/server/database/schema";
import { and, eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const params = event.context.params?.mediaId;

  if (params) {
    const [mediaId, userId] = params.split("/");

    if (!userId) {
      return db.delete(vote).where(eq(vote.mediaId, mediaId));
    }
    return db
      .delete(vote)
      .where(and(eq(vote.mediaId, mediaId), eq(vote.userId, userId)));
  }

  throw createError({
    statusCode: 400,
    statusMessage: "Missing mediaId query parameter",
  });
});
