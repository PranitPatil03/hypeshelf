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

// --- Review Generation Logic ---
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

    // Combine randomly
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
    9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
    10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

async function seed() {
    console.log("Starting Seeding Process...");

    // 1. Fetch existing users to delete test ones
    console.log("Cleaning up old test users in Clerk...");
    const clerkRes = await fetch("https://api.clerk.com/v1/users?limit=100", {
        headers: { "Authorization": `Bearer ${CLERK_SECRET_KEY}` }
    });
    const clerkUsers = await clerkRes.json();
    for (const u of clerkUsers) {
        if (u.email_addresses && u.email_addresses[0]?.email_address.endsWith("313@gmail.com")) {
            await fetch(`https://api.clerk.com/v1/users/${u.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${CLERK_SECRET_KEY}` }
            });
            console.log(`Deleted Clerk user ${u.id}`);
        }
    }

    // 2. Create 10 new distinct users
    console.log("Creating 10 new dummy users in Clerk...");
    const dummyUsers: { clerkId: string; name: string; email: string; role: "user" }[] = [];
    const names = [
        "Emily Chen", "Michael Rodriguez", "Sarah Jenkins", "David Kim",
        "Jessica Taylor", "Christopher Lee", "Amanda Patel",
        "Matthew Davis", "Olivia Martinez", "Daniel Wilson"
    ];

    for (let i = 0; i < 10; i++) {
        const firstName = names[i].split(" ")[0].toLowerCase();
        const lastName = names[i].split(" ")[1].toLowerCase();
        const email = `${firstName}${lastName}313@gmail.com`;
        const res = await fetch("https://api.clerk.com/v1/users", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CLERK_SECRET_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email_address: [email],
                password: "TestUser2026!",
                skip_password_checks: true,
                first_name: names[i].split(" ")[0],
                last_name: names[i].split(" ")[1]
            })
        });

        if (!res.ok) {
            console.error(`Failed to create user ${email}`, await res.text());
            continue;
        }

        const data = await res.json();
        console.log(`Created user: ${email} -> ${data.id}`);
        dummyUsers.push({
            clerkId: data.id,
            name: names[i],
            email: email,
            role: "user" as const
        });
    }

    // 3. Fetch 1000 TMDB Movies
    console.log("Fetching 1000 movies from TMDB...");
    let allMovies: any[] = [];
    for (let page = 1; page <= 50; page++) {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`);
        const data = await res.json();
        if (data.results) {
            allMovies.push(...data.results);
        }
        if (page % 10 === 0) console.log(`Fetched ${page * 20} movies...`);
    }

    // Map TMDB movies to Recommendations
    const recommendations = allMovies.map(movie => {
        const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
        const hypeScore = Math.floor(Math.random() * 5) * 2 + 2; // 2, 4, 6, 8, or 10
        const isStaffPick = Math.random() > 0.95; // 5% chance to be a staff pick
        const genre = movie.genre_ids && movie.genre_ids.length > 0 ? genreMap[movie.genre_ids[0]] || "Other" : "Other";
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "";

        return {
            userId: randomUser.clerkId,
            userName: randomUser.name,
            userAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${randomUser.clerkId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
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

    // 4. Send to Convex in chunks
    // Since max payload size could be an issue, we'll chunk into batches of 100
    console.log("Seeding to Convex (First batch clears old data)...");
    const chunkSize = 100;
    for (let i = 0; i < recommendations.length; i += chunkSize) {
        const chunk = recommendations.slice(i, i + chunkSize);
        const isFirstChunk = i === 0;

        await convex.mutation(api.seed.runSeed, {
            clear: isFirstChunk,
            users: isFirstChunk ? dummyUsers : [],
            recommendations: chunk
        });

        console.log(`Inserted chunk ${i / chunkSize + 1} / ${Math.ceil(recommendations.length / chunkSize)}`);
    }

    console.log("✅ Seed complete! You now have 10 test users and 1000 recommendations.");
    console.log("Test login using:");
    console.log("Email: emilychen313@gmail.com");
    console.log("Password: TestUser2026!");
}

seed().catch(console.error);
