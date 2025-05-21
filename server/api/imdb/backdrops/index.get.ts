export default defineEventHandler(async () => {
  const data = await $fetch(
    "https://api.themoviedb.org/3/trending/all/day?api_key=12eaa43ab98e6a3452d414c6eb4e2406",
  );
  return data.results
    .filter((x) => x.media_type !== "person")
    .map((x) => "https://image.tmdb.org/t/p/original" + x.backdrop_path)
    .filter((backdropPath) => !!backdropPath);
});
