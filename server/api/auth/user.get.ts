interface PlexUserResponse {
  user: {
    id: number;
    uuid: string;
    email: string;
    joined_at: string;
    username: string;
    thumb: string;
  };
}

export default defineEventHandler(async (event) => {
  const response: PlexUserResponse = await event.$fetch(
    "https://plex.tv/users/account.json",
  );
  const user = response.user;

  const exist = await $fetch(`/api/users/${response.user.uuid}`);
  if (!exist) {
    return await $fetch(`/api/users`, {
      method: "POST",
      body: {
        id: user.uuid,
        username: user.username,
        avatar: user.thumb,
        email: user.email,
        createdAt: user.joined_at,
      },
    });
  }

  return exist;
});
