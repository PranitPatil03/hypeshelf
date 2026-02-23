const fs = require('fs');

const realMovies = [
  ["The Shawshank Redemption", "Drama", "A masterpiece of hope and friendship."],
  ["The Godfather", "Drama", "The greatest mob movie ever made."],
  ["The Dark Knight", "Action", "Heath Ledger's Joker is unforgettable."],
  ["The Godfather Part II", "Drama", "A rare sequel that equals the original."],
  ["12 Angry Men", "Drama", "Brilliant writing and acting in one room."],
  ["Schindler's List", "Drama", "A profound and harrowing historical film."],
  ["The Lord of the Rings: The Return of the King", "Action", "An epic conclusion to a perfect trilogy."],
  ["Pulp Fiction", "Thriller", "Tarantino's non-linear storytelling at its best."],
  ["The Lord of the Rings: The Fellowship of the Ring", "Action", "A magical start to an incredible journey."],
  ["The Good, the Bad and the Ugly", "Action", "The defining spaghetti western."],
  ["Forrest Gump", "Drama", "A beautiful journey through American history."],
  ["Fight Club", "Thriller", "A brutal and mind-bending satire."],
  ["The Lord of the Rings: The Two Towers", "Action", "The battle of Helm's Deep is legendary."],
  ["Inception", "Sci-Fi", "A visually stunning mind heist."],
  ["Star Wars: Episode V - The Empire Strikes Back", "Sci-Fi", "The best Star Wars movie, period."],
  ["The Matrix", "Sci-Fi", "Revolutionary action and philosophy."],
  ["Goodfellas", "Thriller", "Fast-paced, authentic mafia story."],
  ["One Flew Over the Cuckoo's Nest", "Drama", "An incredible performance by Jack Nicholson."],
  ["Se7en", "Thriller", "A gritty and shocking detective story."],
  ["City of God", "Drama", "A raw and energetic look at Rio's favelas."],
  ["It's a Wonderful Life", "Drama", "A timeless holiday classic."],
  ["The Silence of the Lambs", "Thriller", "Hopkins is terrifyingly brilliant."],
  ["Star Wars: Episode IV - A New Hope", "Sci-Fi", "The movie that started it all."],
  ["Saving Private Ryan", "Action", "The most visceral war movie ever made."],
  ["The Green Mile", "Drama", "A beautifully emotional Stephen King adaptation."],
  ["Interstellar", "Sci-Fi", "Visuals and score are out of this world."],
  ["Spirited Away", "Action", "Miyazaki's animation masterpiece."],
  ["Parasite", "Thriller", "A genius exploration of class divide."],
  ["Léon: The Professional", "Action", "A touching story with incredible action."],
  ["Gladiator", "Action", "Epic historical drama at its finest."],
  ["The Pianist", "Drama", "A haunting survivor story."],
  ["The Terminator", "Action", "A relentless and iconic sci-fi action film."],
  ["Back to the Future", "Sci-Fi", "The perfect time travel movie."],
  ["Modern Times", "Comedy", "Chaplin's hilarious critique of industrialization."],
  ["Psycho", "Horror", "Hitchcock invented the modern thriller here."],
  ["The Lion King", "Drama", "Disney's animated crown jewel."],
  ["City Lights", "Comedy", "A beautiful blend of comedy and romance."],
  ["American History X", "Drama", "A powerful look at hatred and redemption."],
  ["Whiplash", "Drama", "Intense and gripping musical drama."],
  ["The Departed", "Thriller", "Scorsese's frantic undercover cop masterpiece."],
  ["The Prestige", "Thriller", "Nolan's best twist-filled puzzle box film."],
  ["Memento", "Thriller", "A genius backwards narrative."],
  ["Apocalypse Now", "Drama", "A surreal and terrifying war experience."],
  ["Alien", "Horror", "The ultimate haunted house movie in space."],
  ["Grave of the Fireflies", "Drama", "Heartbreaking animated anti-war film."],
  ["WALL·E", "Sci-Fi", "Pixar's beautiful silent-film-esque sci-fi romance."],
  ["The Shining", "Horror", "Kubrick's atmospheric descent into madness."],
  ["Django Unchained", "Action", "Tarantino's explosive spaghetti western homage."],
  ["The Truman Show", "Comedy", "A prescient and deeply emotional satirical comedy."],
  ["Jurassic Park", "Sci-Fi", "Groundbreaking effects and pure adventure."]
];

const authors = ['Alex Mercer', 'Sarah Jenkins', 'Jordan Lee', 'Mia Torres', 'David Chen'];

const result = realMovies.map((movie, i) => {
  const isStaffPick = Math.random() > 0.8;
  const score = (Math.random() * 1.5 + 8.5).toFixed(1);
  return `    {
        id: '${i + 1}',
        title: ${JSON.stringify(movie[0])},
        genre: '${movie[1]}',
        link: \`\${JSON.stringify("https://www.imdb.com/find?q=" + encodeURIComponent(movie[0]))}\`,
        blurb: ${JSON.stringify(movie[2])},
        authorName: '${authors[i % authors.length]}',
        isStaffPick: ${isStaffPick},
        createdAt: '2023-11-${Math.floor(Math.random() * 28 + 1)}T10:00:00Z',
        posterUrl: 'https://image.tmdb.org/t/p/w500/',
        hypeScore: ${score}
    }`;
});

const content = `export type Genre = 'Action' | 'Comedy' | 'Drama' | 'Sci-Fi' | 'Horror' | 'Thriller' | 'Romance' | 'Documentary';

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

export const DUMMY_RECOMMENDATIONS: Recommendation[] = [
${result.join(',\n')}
];
`;

fs.writeFileSync('lib/dummy-data.ts', content);
