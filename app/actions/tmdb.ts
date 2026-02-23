'use server'

const genreMap: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

export async function searchMovies(query: string) {
    if (!query) return [];

    // We expect TMDB_API_KEY or TMDB_READ_ACCESS_TOKEN to be in the env
    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        console.error("No TMDB_API_KEY found in environment variables.");
        return [];
    }

    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`, {
            // Next.js fetch caching option, search could be cached if we want but mostly it's dynamic
            cache: 'no-store'
        });

        if (!res.ok) {
            throw new Error(`TMDB API Error: ${res.statusText}`);
        }

        const data = await res.json();

        return data.results.slice(0, 5).map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            poster_path: movie.poster_path, // Need to append https://image.tmdb.org/t/p/w500 on client
            genre: movie.genre_ids && movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] || "Other" : "Other"
        }));
    } catch (e) {
        console.error("Failed to fetch from TMDB:", e);
        return [];
    }
}
