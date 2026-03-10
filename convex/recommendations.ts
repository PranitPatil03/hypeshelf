import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { isAdminEmail } from "./lib/admin";

const ALLOWED_GENRES = [
    "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Thriller", "Romance", "Documentary",
    "Other", "Adventure", "Animation", "Crime", "Family", "Fantasy", "History",
    "Music", "Mystery", "TV Movie", "War", "Western",
];

const MAX_TITLE_LENGTH = 200;
const MAX_BLURB_LENGTH = 250;

function isSafeUrl(url: string): boolean {
    if (url === "") return true;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

const MAX_PAGE_SIZE = 100;

export const getAll = query({
    args: {
        genre: v.optional(v.string()),
        myRecs: v.optional(v.boolean()),
        staffPicks: v.optional(v.boolean()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const paginationOpts = {
            ...args.paginationOpts,
            numItems: Math.min(args.paginationOpts.numItems, MAX_PAGE_SIZE),
        };

        if (args.myRecs) {
            const identity = await ctx.auth.getUserIdentity();
            if (!identity) {
                throw new Error("Must be logged in to view your recs");
            }
            return await ctx.db
                .query("recommendations")
                .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
                .order("desc")
                .paginate(paginationOpts);
        } else if (args.staffPicks) {
            return await ctx.db
                .query("recommendations")
                .withIndex("by_staffPick", (q) => q.eq("isStaffPick", true))
                .order("desc")
                .paginate(paginationOpts);
        } else if (args.genre && args.genre !== "All") {
            return await ctx.db
                .query("recommendations")
                .withIndex("by_genre", (q) => q.eq("genre", args.genre!))
                .order("desc")
                .paginate(paginationOpts);
        }

        return await ctx.db.query("recommendations").order("desc").paginate(paginationOpts);
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        genre: v.string(),
        blurb: v.string(),
        link: v.string(),
        posterUrl: v.string(),
        hypeScore: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Must be logged in to create a recommendation");
        }
        const title = args.title.trim();
        const blurb = args.blurb.trim();

        const recentCount = await ctx.db.query('recommendations')
            .withIndex('by_userId', q => q.eq('userId', identity.subject))
            .filter(q => q.gte(q.field('_creationTime'), Date.now() - 3600000))
            .take(21);

        if (recentCount.length >= 20) {
            throw new Error('Rate limit: max 20 recommendations per hour');
        }

        if (!title || title.length > MAX_TITLE_LENGTH) {
            throw new Error(`Title must be between 1 and ${MAX_TITLE_LENGTH} characters`);
        }
        if (!blurb || blurb.length > MAX_BLURB_LENGTH) {
            throw new Error(`Review must be between 1 and ${MAX_BLURB_LENGTH} characters`);
        }
        if (!ALLOWED_GENRES.includes(args.genre)) {
            throw new Error(`Invalid genre: ${args.genre}`);
        }
        if (!isSafeUrl(args.link)) {
            throw new Error("Link must be a valid http/https URL");
        }
        if (!isSafeUrl(args.posterUrl)) {
            throw new Error("Poster URL must be a valid http/https URL");
        }
        if (args.hypeScore < 1 || args.hypeScore > 10) {
            throw new Error("Hype score must be between 1 and 10");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            throw new Error("User not found in database");
        }

        return await ctx.db.insert("recommendations", {
            userId: user.clerkId,
            userName: user.name,
            userAvatar: identity.pictureUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`,
            title,
            genre: args.genre,
            blurb,
            link: args.link,
            posterUrl: args.posterUrl,
            hypeScore: args.hypeScore,
            isStaffPick: false,
        });
    },
});

export const remove = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const rec = await ctx.db.get(args.id);
        if (!rec) throw new Error("Recommendation not found");

        const isAdmin = isAdminEmail(identity.email);

        if (rec.userId !== identity.subject && !isAdmin) {
            throw new Error("Unauthorized: you can only delete your own recommendations");
        }

        await ctx.db.delete(args.id);
    },
});

export const toggleStaffPick = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        if (!isAdminEmail(identity.email)) {
            throw new Error("Only admins can toggle staff picks");
        }

        const rec = await ctx.db.get(args.id);
        if (!rec) throw new Error("Recommendation not found");

        await ctx.db.patch(args.id, {
            isStaffPick: !rec.isStaffPick,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("recommendations"),
        title: v.string(),
        genre: v.string(),
        blurb: v.string(),
        link: v.string(),
        posterUrl: v.string(),
        hypeScore: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const rec = await ctx.db.get(args.id);
        if (!rec) throw new Error("Recommendation not found");

        const isAdmin = isAdminEmail(identity.email);

        if (rec.userId !== identity.subject && !isAdmin) {
            throw new Error("Unauthorized: you can only edit your own recommendations");
        }

        const title = args.title.trim();
        const blurb = args.blurb.trim();

        const recentEditsCount = await ctx.db.query('recommendations')
            .withIndex('by_userId', q => q.eq('userId', identity.subject))
            .filter(q => q.gte(q.field('_creationTime'), Date.now() - 3600000))
            .take(21);

        if (recentEditsCount.length >= 20) {
            throw new Error('Rate limit: max 20 recommendations per hour');
        }

        if (!title || title.length > MAX_TITLE_LENGTH) {
            throw new Error(`Title must be between 1 and ${MAX_TITLE_LENGTH} characters`);
        }
        if (!blurb || blurb.length > MAX_BLURB_LENGTH) {
            throw new Error(`Review must be between 1 and ${MAX_BLURB_LENGTH} characters`);
        }
        if (!ALLOWED_GENRES.includes(args.genre)) {
            throw new Error(`Invalid genre: ${args.genre}`);
        }
        if (!isSafeUrl(args.link)) {
            throw new Error("Link must be a valid http/https URL");
        }
        if (!isSafeUrl(args.posterUrl)) {
            throw new Error("Poster URL must be a valid http/https URL");
        }
        if (args.hypeScore < 1 || args.hypeScore > 10) {
            throw new Error("Hype score must be between 1 and 10");
        }

        await ctx.db.patch(args.id, {
            title,
            genre: args.genre,
            blurb,
            link: args.link,
            posterUrl: args.posterUrl,
            hypeScore: args.hypeScore,
        });
    },
});
