export default defineEventHandler(async () => {
  const data = await $fetch(
    "https://api.themoviedb.org/3/trending/all/day?api_key=db55323b8d3e4154498498a75642b381",
  );
  return data.results
    .filter((x) => x.media_type !== "person")
    .map((x) => "https://image.tmdb.org/t/p/original" + x.backdrop_path)
    .filter((backdropPath) => !!backdropPath);
});
