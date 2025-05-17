import { db } from "~/server/database";
import { vote, user } from "~/server/database/schema";
import { eq } from "drizzle-orm";

type User = typeof user.$inferInsert;

export default defineEventHandler(() => {
  const rows = db
    .select({
      mediaId: vote.mediaId,
      user,
    })
    .from(vote)
    .innerJoin(user, eq(vote.userId, user.id))
    .all();

  const result = rows.reduce<Record<string, { media: string; users: User[] }>>(
    (acc, row) => {
      const mediaId = row.mediaId;
      const user = row.user;

      if (!acc[mediaId]) {
        acc[mediaId] = { mediaId, users: [] };
      }

      if (mediaId) {
        acc[mediaId].users.push(user);
      }

      return acc;
    },
    {},
  );

  return Object.values(result).sort((a, b) => b.users.length - a.users.length);
});
