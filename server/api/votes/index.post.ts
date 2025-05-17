import { db } from "~/server/database";
import { vote } from "~/server/database/schema";
import { eq, and } from "drizzle-orm";

interface MultipleVotes {
  mediaIds: string[];
  userId: string;
  mediaType: string;
}

export default defineEventHandler(async (event) => {
  try {
    const data: MultipleVotes = await readBody(event);

    // delete previous user votes for this mediaType (movie/tv)
    await db
      .delete(vote)
      .where(
        and(eq(vote.userId, data.userId), eq(vote.mediaType, data.mediaType)),
      );

    const voteInserts = data.mediaIds.map((movieId) => ({
      mediaId: movieId,
      userId: data.userId,
      mediaType: data.mediaType,
    }));
    await db.insert(vote).values(voteInserts);
    return { response: "a voté" };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
