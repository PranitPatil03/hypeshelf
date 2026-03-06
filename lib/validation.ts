import { z } from 'zod';
import { MOVIE_GENRES } from './constants';

export const ALLOWED_GENRES = [
    ...MOVIE_GENRES,
    'Documentary',
    'Other',
    'Adventure',
    'Animation',
    'Crime',
    'Family',
    'Fantasy',
    'History',
    'Music',
    'Mystery',
    'Science Fiction',
    'TV Movie',
    'War',
    'Western',
] as const;

const safeUrlSchema = z
    .string()
    .trim()
    .refine(
        (val) => val === '' || /^https?:\/\/.+/.test(val),
        { message: 'Must be a valid http or https URL' }
    );

export const recommendationSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, 'Title is required')
        .max(200, 'Title must be under 200 characters'),
    genre: z
        .string()
        .min(1, 'Genre is required')
        .refine(
            (val) => (ALLOWED_GENRES as readonly string[]).includes(val),
            { message: 'Invalid genre selected' }
        ),
    blurb: z
        .string()
        .trim()
        .min(1, 'Review is required')
        .max(250, 'Review must be under 250 characters'),
    link: safeUrlSchema,
    posterUrl: safeUrlSchema,
    hypeScore: z
        .number()
        .min(1, 'Hype score must be at least 1')
        .max(10, 'Hype score must be at most 10'),
});

export type RecommendationInput = z.infer<typeof recommendationSchema>;
