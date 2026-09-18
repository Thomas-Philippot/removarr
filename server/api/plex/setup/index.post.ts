import {
  getSettings,
  type MediaLibrary,
} from "~/server/repository/settingRepository";
import xml2js from "xml2js";
import { randomUUID } from "crypto";

interface PlexStatusResponse {
  MediaContainer: {
    machineIdentifier?: string;
  };
}

export interface PlexResponse {
  MediaContainer: {
    size: number;
    allowSync: boolean;
    title1: string;
    Directory?: PlexLibraryResponse | PlexLibraryResponse[];
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
  Location?: PlexLocationResponse | PlexLocationResponse[];
}

interface PlexLocationResponse {
  id: number;
  path: string;
}

const asArray = <T>(value?: T | T[]): T[] => {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
};

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);
  const token = data.token;

  let hostname = settings.main.mediaServer.hostname;
  if (settings.main.mediaServer.mode === "ip") {
    hostname = settings.main.mediaServer.ip;
  }
  const baseUrl = `${settings.main.mediaServer.schema}${hostname}:${settings.main.mediaServer.port}`;

  if (!settings.main.mediaServer.api_uuid) {
    settings.main.mediaServer.api_uuid = randomUUID();
  }

  if (data.token) {
    settings.main.mediaServer.apiKey = data.token;
  }

  const queryPlex = async <T>(path: string): Promise<T> => {
    if (!token) {
      throw createError({
        statusCode: 400,
        statusMessage: "Plex Token not found!",
      });
    }

    const response = await $fetch(`${baseUrl}${path}`, {
      headers: {
        "X-Plex-Token": token,
        "X-Plex-Client-Identifier": settings.main.mediaServer.api_uuid!,
        "X-Plex-Device-Name": "Removarr",
        "X-Plex-Platform": "Removarr",
        "X-Plex-Product": "Removarr",
      },
      responseType: "text",
    });

    return (await xml2js.parseStringPromise(response, {
      explicitArray: false,
      mergeAttrs: true,
    })) as T;
  };

  const status = await queryPlex<PlexStatusResponse>("/");
  if (!status?.MediaContainer?.machineIdentifier) {
    throw createError({
      statusCode: 400,
      statusMessage: "Server not found",
    });
  }

  settings.main.mediaServer.machineId = status.MediaContainer.machineIdentifier;

  settings.save();

  try {
    const response = await queryPlex<PlexResponse>("/library/sections");
    const libraries = asArray(response.MediaContainer.Directory);

    settings.main.mediaServer.libraries = libraries
      // Remove setup that are not movie or show
      .filter((library) => library.type === "movie" || library.type === "show")
      // Remove setup that do not have a metadata agent set (usually personal video setup)
      .filter((library) => library.agent !== "com.plexapp.agents.none")
      .map((library) => ({
        ...library,
        Location: asArray(library.Location),
      }))
      .filter((library) => library.Location.length > 0)
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
