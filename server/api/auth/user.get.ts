import { getSettings } from "~/server/repository/settingRepository";
import type { User } from "~/server/database/schema";
interface PlexUserResponse {
  user: {
    id: number;
    uuid: string;
    email: string;
    joined_at: string;
    username: string;
    thumb: string;
    avatar: string;
    authToken: string;
  };
}

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const user = await getUser(settings, event);

  console.log(user);

  const exist: User = await $fetch(`/api/users/${user.id}`);
  if (!exist) {
    if (
      settings.main.mediaServer.type === "plex" &&
      settings.main.mediaServer.machineId
    ) {
      // check if user has access to plex shared library
      const plexUsers = await $fetch("/api/plex/users");
      const plexUser = plexUsers?.find((u) => u.$.id === user.id);
      if (!plexUser) {
        // access denied
        return false;
      }

      const inServer = plexUser?.Server?.find(
        (server) =>
          server.$.machineIdentifier === settings.main.mediaServer.machineId,
      );

      if (!inServer) {
        // access denied
        return false;
      }
    }

    return await $fetch(`/api/users`, {
      method: "POST",
      body: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  }

  // Token refresh if changed
  if (
    exist.role === "admin" &&
    user.authToken !== settings.main.mediaServer.apiKey
  ) {
    await $fetch("/api/settings/mediaServer", {
      method: "POST",
      body: {
        apiKey: user.authToken,
      },
    });
  }

  return exist;
});

async function getUser(settings, event) {
  if (settings.main.mediaServer.type === "plex") {
    const response: PlexUserResponse = await event.$fetch(
      "https://plex.tv/users/account.json",
    );
    return {
      id: response.user.uuid,
      username: response.user.username,
      avatar: response.user.thumb,
      email: response.user.email,
      createdAt: response.user.joined_at,
      authToken: response.user.authToken,
    };
  }

  const response = await $fetch("/mediaServer/Users/Me");

  const imagePath = `UserImage?userId=${response.Id}`;
  const imageUrl =
    settings.main.mediaServer.mode === "ip"
      ? `${settings.main.mediaServer.schema}${settings.main.mediaServer.ip}:${settings.main.mediaServer.port}/${imagePath}`
      : `${settings.main.mediaServer.schema}${settings.main.mediaServer.hostname}/${imagePath}`;

  return {
    id: response.Id,
    username: response.Name,
    avatar: imageUrl,
    email: "",
    createdAt: "",
    authToken: settings.main.mediaServer.auth_token ?? "",
  };
}
