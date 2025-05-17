export default defineEventHandler(async (event) => {
  const data = await readBody(event);

  return { token: data.authToken };
});
