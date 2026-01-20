import { getSettings } from "~/server/repository/settingRepository";

export default defineEventHandler(async (event) => {
  const settings = getSettings().load();
  const data = await readBody(event);
  // const token = data.token;

  // let hostname = settings.main.mediaServer.hostname;
  // if (settings.main.mediaServer.mode === "ip") {
  //   hostname = settings.main.mediaServer.ip;
  // }

  if (data.token) {
    settings.main.mediaServer.apiKey = data.token;
  }

  settings.main.mediaServer.machineId = status.MediaContainer.machineIdentifier;

  settings.save();

  try {
    // const libraries =  const token = data.token;
    //
    //   let hostname = settings.main.mediaServer.hostname;
    //   if (settings.main.mediaServer.mode === "ip") {
    //     hostname = settings.main.mediaServer.ip;
    //   } []

    // settings.main.mediaServer.libraries = libraries
    settings.save();
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: "Jellyfin Server error",
    });
  }
});
