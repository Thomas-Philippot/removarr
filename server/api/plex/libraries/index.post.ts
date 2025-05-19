import PlexApi from "plex-api";
import { getSettings } from "~/server/repository/settingRepository";

export interface Library {
  id: string;
  name: string;
  enabled: boolean;
  type: "show" | "movie";
  lastScan?: number;
}

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);
  const token = data.token;
  const client = new PlexApi({
    hostname: "192.168.1.181",
    port: 32400,
    https: false,
    token,
    authenticator: {
      authenticate: (_plexApi, cb: (err?: string, token?: string) => void) => {
        if (!token) {
          return cb("Plex Token not found!");
        }
        cb(undefined, token.value.token);
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

  try {
    const response = await client.query("/library/sections");
    const libraries = response.MediaContainer.Directory;

    settings.main.plex.libraries = libraries
      // Remove libraries that are not movie or show
      .filter((library) => library.type === "movie" || library.type === "show")
      // Remove libraries that do not have a metadata agent set (usually personal video libraries)
      .filter((library) => library.agent !== "com.plexapp.agents.none")
      .map((library) => {
        const existing = settings.main.plex.libraries.find(
          (l) => l.id === library.key && l.name === library.title,
        );

        return {
          id: library.key,
          name: library.title,
          enabled: existing?.enabled ?? true,
          type: library.type,
          path: library.Location[0].path,
        };
      });
    settings.save();
  } catch (error) {
    console.log(error);
    return;
  }
});
