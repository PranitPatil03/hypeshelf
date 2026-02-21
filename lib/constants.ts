export const MOVIE_GENRES = [
    'Action',
    'Comedy',
    'Drama',
    'Sci-Fi',
    'Horror',
    'Thriller',
    'Romance',
    'Documentary'
] as const;

export type MovieGenre = typeof MOVIE_GENRES[number];
