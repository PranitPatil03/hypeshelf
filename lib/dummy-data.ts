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
}

export const DUMMY_RECOMMENDATIONS: Recommendation[] = [
    {
        id: '1',
        title: 'Dune: Part Two',
        genre: 'Sci-Fi',
        link: 'https://www.imdb.com/title/tt15239678/',
        blurb: 'A stunning visual masterpiece that perfectly adapts the second half of Herbert\'s iconic novel. The sound design alone is worth watching it in theaters.',
        authorName: 'Sarah Jenkins',
        isStaffPick: true,
        createdAt: '2023-11-20T10:00:00Z',
    },
    {
        id: '2',
        title: 'Parasite',
        genre: 'Thriller',
        link: 'https://www.imdb.com/title/tt6751668/',
        blurb: 'Bong Joon Ho\'s brilliant commentary on class divide wrapped in an incredibly tense and unpredictable thriller. A modern masterpiece.',
        authorName: 'Alex Mercer',
        isStaffPick: true,
        createdAt: '2023-10-15T14:30:00Z',
    },
    {
        id: '3',
        title: 'Everything Everywhere All at Once',
        genre: 'Action',
        link: 'https://a24films.com/films/everything-everywhere-all-at-once',
        blurb: 'The most creative and heartfelt action movie I have ever seen. It manages to balance profound philosophy with hot dog fingers.',
        authorName: 'Jordan Lee',
        createdAt: '2023-12-01T09:15:00Z',
    },
    {
        id: '4',
        title: 'Get Out',
        genre: 'Horror',
        link: 'https://www.imdb.com/title/tt5052448/',
        blurb: 'Jordan Peele knocked it out of the park with this atmospheric horror that slowly builds dread into a fantastic third act.',
        authorName: 'Mia Torres',
        createdAt: '2023-11-05T18:45:00Z',
    },
    {
        id: '5',
        title: 'Spider-Man: Across the Spider-Verse',
        genre: 'Action',
        link: 'https://www.sonypictures.com/movies/spidermanacrossthespiderverse',
        blurb: 'Every single frame of this movie looks like a painting. It pushes the boundaries of what animation can do.',
        authorName: 'David Chen',
        createdAt: '2024-01-10T20:20:00Z',
    },
    {
        id: '6',
        title: 'Knives Out',
        genre: 'Comedy',
        link: 'https://knivesout.movie/',
        blurb: 'A completely fresh and hilarious take on the classic whodunit murder mystery. Daniel Craig\'s accent is absolute gold.',
        authorName: 'Emily Watson',
        createdAt: '2023-09-22T11:10:00Z',
    }
];
