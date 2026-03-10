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
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

export async function searchMovies(query: string) {
    if (!query) return [];

    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
        return [];
    }

    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}&language=en-US&page=1&include_adult=false`, {
            cache: 'no-store',
            headers: {
                accept: 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`TMDB API Error: ${res.statusText}`);
        }

        const data = await res.json();

        return data.results.slice(0, 5).map((movie: { id: number; title: string; release_date: string; poster_path: string | null; genre_ids: number[] }) => ({
            id: movie.id,
            title: movie.title,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            genre: movie.genre_ids && movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] || "Other" : "Other"
        }));
    } catch (e) {
        return [];
    }
}
