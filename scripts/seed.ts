import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

function getEnvVars() {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (!fs.existsSync(envPath)) {
        throw new Error("Missing .env.local");
    }
    const content = fs.readFileSync(envPath, "utf8");
    const env: Record<string, string> = {};
    for (const line of content.split("\n")) {
        const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            env[match[1]] = match[2] ? match[2].trim() : "";
        }
    }
    return env;
}

const env = getEnvVars();
const CLERK_SECRET_KEY = env.CLERK_SECRET_KEY;
const TMDB_API_KEY = env.TMDB_API_KEY;
const NEXT_PUBLIC_CONVEX_URL = env.NEXT_PUBLIC_CONVEX_URL;

if (!CLERK_SECRET_KEY) throw new Error("Missing CLERK_SECRET_KEY");
if (!TMDB_API_KEY) throw new Error("Missing TMDB_API_KEY");
if (!NEXT_PUBLIC_CONVEX_URL) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");

const convex = new ConvexHttpClient(NEXT_PUBLIC_CONVEX_URL);

const highHypeStarts = [
    "Mind-blowing visuals.", "A total masterpiece.", "Literally could not stop watching.",
    "Classic.", "One of my recent favorites.", "Easily in my top 10.",
    "Absolutely breathtaking.", "The pacing was perfect.", "Unbelievable cinematic experience."
];
const midHypeStarts = [
    "Not perfect, but incredibly entertaining.", "A solid watch for a lazy Sunday.",
    "Overhyped but still decent.", "Enjoyed the first half.", "Great concept, decent execution.",
    "Worth watching at least once.", "It was okay, nothing special but decent."
];

function generateReview(movieOverview: string, score: number) {
    const list = score >= 8 ? highHypeStarts : midHypeStarts;
    const start = list[Math.floor(Math.random() * list.length)];
    const overviewTruncated = movieOverview ? movieOverview.substring(0, 100).trim() + "..." : "Really interesting premise and solid execution.";

    const options = [
        `${start} ${overviewTruncated}`,
        `${overviewTruncated} ${start}`,
        `${start} Loved the characters.`,
        `Honestly, ${start.toLowerCase()} Keeps you hooked.`
    ];
    return options[Math.floor(Math.random() * options.length)];
}

const genreMap: Record<number, string> = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

async function seed() {
    console.log("Starting Seeding Process...");

    console.log("Fetching existing users from Clerk...");
    const clerkRes = await fetch("https://api.clerk.com/v1/users?limit=100", {
        headers: { "Authorization": `Bearer ${CLERK_SECRET_KEY}` }
    });
    const clerkUsers = await clerkRes.json();

    const existingUsers = clerkUsers.map((u: any) => {
        const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Anonymous";
        const email = u.email_addresses?.[0]?.email_address || "";
        return {
            clerkId: u.id,
            name,
            email,
            role: "user" as const,
        };
    });

    if (existingUsers.length === 0) {
        throw new Error("No existing Clerk users found!");
    }
    console.log(`Found ${existingUsers.length} existing users.`);

    const genreQueries: Record<string, number> = {
        Action: 28, Comedy: 35, Drama: 18, "Sci-Fi": 878,
        Horror: 27, Thriller: 53, Romance: 10749,
        Adventure: 12, Animation: 16, Crime: 80, Documentary: 99,
        Fantasy: 14,
    };

    console.log("Fetching movies by genre from TMDB...");
    let allMovies: any[] = [];
    const seen = new Set<number>();

    for (const [genreName, genreId] of Object.entries(genreQueries)) {
        for (let page = 1; page <= 2; page++) {
            const res = await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`
            );
            const data = await res.json();
            if (data.results) {
                for (const m of data.results) {
                    if (!seen.has(m.id)) {
                        seen.add(m.id);
                        allMovies.push({ ...m, _forcedGenre: genreName });
                    }
                }
            }
        }
        console.log(`Fetched ${genreName}: ${allMovies.length} total unique movies so far`);
    }

    allMovies.sort(() => Math.random() - 0.5);
    allMovies = allMovies.slice(0, 220);

    const recommendations = allMovies.map(movie => {
        const randomUser = existingUsers[Math.floor(Math.random() * existingUsers.length)];
        const hypeScore = Math.floor(Math.random() * 5) * 2 + 2;
        const isStaffPick = Math.random() > 0.85; // ~15% staff picks
        const genre = movie._forcedGenre || (movie.genre_ids && movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] || "Other" : "Other");
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "";

        return {
            userId: randomUser.clerkId,
            userName: randomUser.name,
            userAvatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(randomUser.name)}`,
            title: movie.title,
            genre: genre,
            link: `https://www.themoviedb.org/movie/${movie.id}`,
            blurb: generateReview(movie.overview, hypeScore),
            hypeScore: hypeScore,
            isStaffPick,
            posterUrl
        };
    });

    console.log(`Prepared ${recommendations.length} recommendations!`);

    console.log("Seeding to Convex (First batch clears old data)...");
    const chunkSize = 50;
    for (let i = 0; i < recommendations.length; i += chunkSize) {
        const chunk = recommendations.slice(i, i + chunkSize);
        const isFirstChunk = i === 0;

        await convex.mutation(api.seed.runSeed, {
            clear: isFirstChunk,
            users: isFirstChunk ? existingUsers : [],
            recommendations: chunk
        });

        console.log(`Inserted chunk ${i / chunkSize + 1} / ${Math.ceil(recommendations.length / chunkSize)}`);
    }

    console.log(`✅ Seed complete! ${recommendations.length} recommendations using ${existingUsers.length} existing users.`);
}

seed().catch(console.error);
