import { db } from "~/server/database";
import { vote, user } from "~/server/database/schema";
import { eq } from "drizzle-orm";

type User = typeof user.$inferInsert;

interface ResultReccord {
  mediaId: string;
  mediaType: string | null;
  servarrId: string | null;
  users: User[];
}

export default defineEventHandler(() => {
  const rows = db
    .select({
      mediaId: vote.mediaId,
      mediaType: vote.mediaType,
      servarrId: vote.servarrId,
      user,
    })
    .from(vote)
    .innerJoin(user, eq(vote.userId, user.id))
    .all();

  const result = rows.reduce<Record<string, ResultReccord>>((acc, row) => {
    const mediaId = row.mediaId;
    const mediaType = row.mediaType;
    const servarrId = row.servarrId.toString();
    const user = row.user;

    if (!acc[mediaId]) {
      acc[mediaId] = { mediaId, mediaType, servarrId, users: [] };
    }

    if (mediaId) {
      acc[mediaId].users.push(user);
    }

    return acc;
  }, {});

  return Object.values(result).sort((a, b) => b.users.length - a.users.length);
});
