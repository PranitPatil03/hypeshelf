export const MOVIE_GENRES = [
    'Action',
    'Comedy',
    'Sci-Fi',
    'Horror',
    'Thriller',
    'Drama',
    'Romance',
] as const;

export type MovieGenre = typeof MOVIE_GENRES[number];
