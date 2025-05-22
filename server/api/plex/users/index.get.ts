import { getSettings } from "~/server/repository/settingRepository";
import xml2js from "xml2js";

interface UsersResponse {
  MediaContainer: {
    User: {
      $: {
        id: string;
        title: string;
        username: string;
        email: string;
        thumb: string;
      };
      Server: ServerResponse[];
    }[];
  };
}

interface ServerResponse {
  $: {
    id: string;
    serverId: string;
    machineIdentifier: string;
    name: string;
    lastSeenAt: string;
    numLibraries: string;
    owned: string;
  };
}

export default defineEventHandler(async () => {
  try {
    const settings = getSettings().load();
    // const response: PlexResponse = await client.query("/users");
    // console.log(response.MediaContainer)

    const response = await $fetch("https://plex.tv/api/users", {
      headers: {
        "X-Plex-Token": settings.main.plex.auth_token,
      },
      responseType: "text",
    });

    const parsedXml = (await xml2js.parseStringPromise(
      response,
    )) as UsersResponse;

    return parsedXml.MediaContainer.User;
  } catch (error) {
    console.log(error);
    return;
  }
});
