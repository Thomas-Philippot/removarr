import {
  getSettings,
  type MediaLibrary,
} from "~/server/repository/settingRepository";
import PlexApi from "plex-api";
import { randomUUID } from "crypto";

export interface PlexResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    title1: string;
    Directory: PlexLibraryResponse[];
  };
}

interface PlexLibraryResponse {
  allowSync: boolean;
  art: string;
  composite: string;
  filters: boolean;
  refreshing: boolean;
  thumb: string;
  key: string;
  type: string;
  title: string;
  agent: string;
  scanner: string;
  language: string;
  uuid: string;
  updatedAt: number;
  createdAt: number;
  scannedAt: number;
  content: boolean;
  directory: boolean;
  contentChangedAt: number;
  hidden: number;
  Location: PlexLocationResponse[];
}

interface PlexLocationResponse {
  id: number;
  path: string;
}

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);
  const token = data.token;

  let hostname = settings.main.mediaServer.hostname;
  if (settings.main.mediaServer.mode === "ip") {
    hostname = settings.main.mediaServer.ip;
  }

  const client = new PlexApi({
    hostname,
    port: settings.main.mediaServer.port,
    https: settings.main.mediaServer.schema === "https://",
    token,
    authenticator: {
      authenticate: (
        _plexApi: PlexApi,
        cb: (err?: string, token?: string) => void,
      ) => {
        if (!token) {
          return cb("Plex Token not found!");
        }
        cb(undefined, token);
      },
    },
    // requestOptions: {
    //   includeChildren: 1,
    // },
    options: {
      identifier: data.uuid,
      product: "Removarr",
      deviceName: "Removarr",
      platform: "Removarr",
    },
  });

  if (!settings.main.mediaServer.api_uuid) {
    settings.main.mediaServer.api_uuid = randomUUID();
  }

  if (data.token) {
    settings.main.mediaServer.apiKey = data.token;
  }

  const status = await client.query("/");
  if (!status?.MediaContainer?.machineIdentifier) {
    throw createError({
      statusCode: 400,
      statusMessage: "Server not found",
    });
  }

  settings.main.mediaServer.machineId = status.MediaContainer.machineIdentifier;

  settings.save();

  try {
    const response: PlexResponse = await client.query("/library/sections");
    const libraries = response.MediaContainer.Directory;

    settings.main.mediaServer.libraries = libraries
      // Remove setup that are not movie or show
      .filter((library) => library.type === "movie" || library.type === "show")
      // Remove setup that do not have a metadata agent set (usually personal video setup)
      .filter((library) => library.agent !== "com.plexapp.agents.none")
      .map((library) => {
        const existing = settings.main.mediaServer.libraries.find(
          (l) => l.id === library.key && l.name === library.title,
        );

        return {
          id: library.key,
          name: library.title,
          enabled: existing?.enabled ?? true,
          type: library.type,
          path: library.Location[0].path,
        } as MediaLibrary;
      });
    settings.save();
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: "Plex Server error",
    });
  }
});
