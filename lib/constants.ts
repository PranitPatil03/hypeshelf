export const MOVIE_GENRES = [
    'Action',
    'Comedy',
    'Drama',
    'Sci-Fi',
    'Horror',
    'Thriller',
    'Romance',
] as const;

export type MovieGenre = typeof MOVIE_GENRES[number];
