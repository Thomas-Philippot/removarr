import { db } from "~/server/database";
import { vote } from "~/server/database/schema";

interface Vote {
  mediaId: string;
  servarrId: number;
}

interface MultipleVotes {
  medias: Vote[];
  userId: string;
  mediaType: string;
}

export default defineEventHandler(async (event) => {
  try {
    const data: MultipleVotes = await readBody(event);
    const voteInserts = data.medias.map((item) => ({
      mediaId: item.mediaId,
      userId: data.userId,
      mediaType: data.mediaType,
      servarrId: item.servarrId,
    }));
    await db.insert(vote).values(voteInserts);
    return { response: "Ok" };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
