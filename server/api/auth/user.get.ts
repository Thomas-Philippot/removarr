import { getSettings } from "~/server/repository/settingRepository";
interface PlexUserResponse {
  user: {
    id: number;
    uuid: string;
    email: string;
    joined_at: string;
    username: string;
    thumb: string;
    authToken: string;
  };
}

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const response: PlexUserResponse = await event.$fetch(
    "https://plex.tv/users/account.json",
  );
  const user = response.user;

  const exist = await $fetch(`/api/users/${user.uuid}`);
  if (!exist) {
    if (settings.main.plex.machineId) {
      // check if user has access to plex shared library
      const plexUsers = await $fetch("/api/plex/users");
      const plexUser = plexUsers?.find((u) => parseInt(u.$.id) === user.id);
      if (!plexUser) {
        // access denied
        return false;
      }

      const inServer = plexUser?.Server?.find(
        (server) => server.$.machineIdentifier === settings.main.plex.machineId,
      );

      if (!inServer) {
        // access denied
        return false;
      }
    }

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

  // Token refresh if changed
  if (
    exist.role === "admin" &&
    user.authToken !== settings.main.plex.auth_token
  ) {
    await $fetch("/api/settings/plex", {
      method: "POST",
      body: {
        auth_token: user.authToken,
      },
    });
  }

  return exist;
});
