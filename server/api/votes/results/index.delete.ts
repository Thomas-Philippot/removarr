import { db } from "~/server/database";
import { vote } from "~/server/database/schema";
import { eq, and } from "drizzle-orm";

interface MultipleVotes {
  medias: string[];
  mediaType: "movie" | "show";
  deleteFiles: boolean;
}

export default defineEventHandler(async (event) => {
  try {
    const data: MultipleVotes = await readBody(event);

    const url = {
      movie: "/radarr/api/v3/movie",
      show: "/sonarr/api/v3/series",
    };

    for (const item of data.medias) {
      const id = parseInt(item);
      const res = await $fetch(url[data.mediaType] + "/" + id, {
        method: "DELETE",
      });
      console.log(res);
      await db
        .delete(vote)
        .where(and(eq(vote.servarrId, id), eq(vote.mediaType, data.mediaType)));
    }

    return { response: "Ok" };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
