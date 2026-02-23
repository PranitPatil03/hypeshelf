import { internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const MOVIES = [
    ["Interstellar", "Sci-Fi", "A visually stunning and emotionally devastating epic."],
    ["The Dark Knight", "Action", "A relentless and chaotic descent into pure anarchy."],
    ["Parasite", "Thriller", "A brilliant, meticulously crafted masterpiece."],
    ["Dune: Part Two", "Sci-Fi", "A monumental achievement in sci-fi worldbuilding."],
    ["Everything Everywhere All at Once", "Action", "An absolute whirlwind of creativity and heart."],
    ["Spider-Man: Across the Spider-Verse", "Action", "Every single frame of this movie is a literal painting."],
    ["Inception", "Sci-Fi", "A flawlessly executed, high-concept puzzle box."],
    ["Get Out", "Horror", "A razor-sharp, painfully relevant horror masterpiece."],
    ["Whiplash", "Drama", "An absolutely suffocating, adrenaline-fueled exploration."],
    ["The Matrix", "Sci-Fi", "Revolutionary in every single sense of the word."],
    ["Spirited Away", "Action", "A transportive, magical journey through an incredibly detailed world."],
    ["Mad Max: Fury Road", "Action", "A two-hour, high-octane car chase that refuses to hit the brakes."],
    ["The Prestige", "Thriller", "A meticulously constructed magic trick of a movie."],
    ["Se7en", "Thriller", "A grimy, atmospheric, and profoundly disturbing detective story."],
    ["Goodfellas", "Thriller", "The definitive, fast-paced mafia epic."],
    ["The Godfather", "Drama", "An absolute masterclass in storytelling and pacing."],
    ["Pulp Fiction", "Thriller", "A completely game-changing collision of cool dialogue."],
    ["The Shawshank Redemption", "Drama", "A profoundly moving emotional journey."],
    ["12 Angry Men", "Drama", "Proof that you do not need big effects to create pure tension."],
    ["Schindler's List", "Drama", "An incredibly harrowing, essential piece of cinema."],
    ["The Truman Show", "Comedy", "A brilliantly prescient satire."],
    ["Fight Club", "Thriller", "A violently kinetic, mind-bending satire."],
    ["City of God", "Drama", "A deeply energetic, raw, and completely unflinching look."],
    ["The Silence of the Lambs", "Thriller", "A masterfully tense psychological thriller."],
    ["Alien", "Horror", "The ultimate haunted house movie set entirely in deep space."],
    ["Saving Private Ryan", "Action", "The most incredibly visceral depiction of war."],
    ["Jurassic Park", "Sci-Fi", "Pure cinematic magic that beautifully balances absolute awe with terror."],
    ["The Terminator", "Action", "A relentless, gritty, and completely terrifying sci-fi slasher."],
    ["Léon: The Professional", "Action", "A completely unconventional, deeply gripping action thriller."],
    ["Gladiator", "Action", "A massive, sweeping historical epic."],
    ["The Pianist", "Drama", "A quiet, deeply harrowing, and incredibly powerful story."],
    ["Back to the Future", "Sci-Fi", "An absolutely perfect screenplay."],
    ["The Lion King", "Drama", "The absolute crown jewel of animation's golden age."],
    ["City Lights", "Comedy", "A brilliant masterclass in physical comedy."],
    ["American History X", "Drama", "A brutal, completely unflinching examination of absolute hatred."],
    ["The Departed", "Thriller", "A high-octane, frantically paced undercover cop thriller."],
    ["Memento", "Thriller", "A totally revolutionary backwards-narrative experiment."],
    ["Apocalypse Now", "Drama", "A hallucinatory, incredibly surreal descent into madness."],
    ["Grave of the Fireflies", "Drama", "The most incredibly devastating, heartbreaking animated film."],
    ["WALL·E", "Sci-Fi", "A completely beautiful, incredibly ambitious sci-fi romance."],
    ["The Shining", "Horror", "A cold, incredibly atmospheric descent into madness."],
    ["Django Unchained", "Action", "An incredibly explosive homage to class spaghetti westerns."],
    ["Modern Times", "Comedy", "A completely hilarious, deeply inventive critique."],
    ["Psycho", "Horror", "The movie that totally invented the modern thriller."],
    ["Knives Out", "Comedy", "A completely hilarious, incredibly fresh take on whodunit."],
    ["Catch Me If You Can", "Thriller", "A totally breezy, incredibly entertaining cat-and-mouse chase."],
    ["Logan", "Action", "A surprisingly grim, incredibly emotional dismantling."],
    ["Arrival", "Sci-Fi", "A brilliantly intelligent, incredibly emotional sci-fi film."],
    ["Blade Runner 2049", "Sci-Fi", "An incredibly atmospheric, visually breathtaking masterpiece."],
    ["Her", "Romance", "A totally beautiful, incredibly melancholic exploration."]
];

export const createAdminAndClear = internalMutation({
    handler: async (ctx) => {
        // Check if we already have the admin
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", "user_dev_patilpranit3112"))
            .unique();

        if (!existing) {
            await ctx.db.insert("users", {
                clerkId: "user_dev_patilpranit3112",
                name: "Pranit Patil",
                email: "patilpranit3112@gmail.com",
                role: "admin",
            });
        }

        // Clear all existing recs so we don't have duplicates
        const allRecs = await ctx.db.query("recommendations").collect();
        for (const rec of allRecs) {
            await ctx.db.delete(rec._id);
        }
    },
});

export const insertRec = internalMutation({
    args: {
        title: v.string(),
        genre: v.string(),
        blurb: v.string(),
        link: v.string(),
        posterUrl: v.string(),
        hypeScore: v.number(),
        isStaffPick: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Get the admin user we created
        const admin = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", "user_dev_patilpranit3112"))
            .unique();

        if (!admin) throw new Error("Admin not found!");

        await ctx.db.insert("recommendations", {
            userId: admin.clerkId,
            userName: admin.name,
            userAvatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${admin.name}`,
            title: args.title,
            genre: args.genre,
            blurb: args.blurb,
            link: args.link,
            posterUrl: args.posterUrl,
            hypeScore: args.hypeScore,
            isStaffPick: args.isStaffPick,
        });
    },
});

export const seed = internalAction({
    handler: async (ctx) => {
        await ctx.runMutation(internal.seed.createAdminAndClear);

        const tmdbKey = process.env.TMDB_READ_ACCESS_TOKEN;
        if (!tmdbKey) {
            throw new Error("TMDB_READ_ACCESS_TOKEN not set in Convex environment");
        }

        let count = 0;
        for (const item of MOVIES) {
            const [title, genre, blurb] = item;

            let posterUrl = "";
            let link = `https://www.themoviedb.org/search?query=${encodeURIComponent(title)}`;

            try {
                const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}`, {
                    headers: {
                        Authorization: `Bearer ${tmdbKey}`,
                        accept: "application/json"
                    }
                });
                const data = await res.json();

                if (data.results && data.results.length > 0) {
                    const movie = data.results[0];
                    if (movie.poster_path) {
                        posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    }
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    link = `https://www.themoviedb.org/movie/${movie.id}-${slug}`;
                }
            } catch (err) {
                console.error("Failed to fetch poster for:", title);
            }

            const isStaffPick = Math.random() > 0.7;
            const hypeScore = Number((Math.random() * 1.5 + 8.5).toFixed(1));

            await ctx.runMutation(internal.seed.insertRec, {
                title,
                genre,
                blurb,
                link,
                posterUrl,
                hypeScore,
                isStaffPick,
            });

            count++;
            console.log(`Inserted ${count}/50: ${title}`);
        }

        return "Successfully seeded 50 real movies & 1 Admin into Convex database!";
    }
});
