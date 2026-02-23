export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Sci-Fi' | 'Horror' | 'Thriller' | 'Romance' | 'Documentary';

export interface Recommendation {
    id: string;
    title: string;
    genre: Genre;
    link: string;
    blurb: string;
    authorName: string;
    isStaffPick?: boolean;
    createdAt: string;
    posterUrl?: string;
    hypeScore?: number;
}

export const DUMMY_RECOMMENDATIONS: Recommendation[] = [];
