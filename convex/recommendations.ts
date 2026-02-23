import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const getLatest = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("recommendations")
            .order("desc")
            .take(6);
    },
});

export const getAll = query({
    args: {
        genre: v.optional(v.string()),
        myRecs: v.optional(v.boolean()),
        staffPicks: v.optional(v.boolean()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        if (args.myRecs) {
            const identity = await ctx.auth.getUserIdentity();
            if (!identity) {
                throw new Error("Must be logged in to view your recs");
            }
            return await ctx.db
                .query("recommendations")
                .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
                .order("desc")
                .paginate(args.paginationOpts);
        } else if (args.staffPicks) {
            return await ctx.db
                .query("recommendations")
                .filter((q) => q.eq(q.field("isStaffPick"), true))
                .order("desc")
                .paginate(args.paginationOpts);
        } else if (args.genre && args.genre !== "All") {
            return await ctx.db
                .query("recommendations")
                .withIndex("by_genre", (q) => q.eq("genre", args.genre!))
                .order("desc")
                .paginate(args.paginationOpts);
        }

        return await ctx.db.query("recommendations").order("desc").paginate(args.paginationOpts);
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

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!user) {
            throw new Error("User not found in mapping");
        }

        return await ctx.db.insert("recommendations", {
            userId: user.clerkId,
            userName: user.name,
            userAvatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`,
            title: args.title,
            genre: args.genre,
            blurb: args.blurb,
            link: args.link,
            posterUrl: args.posterUrl,
            hypeScore: args.hypeScore,
            isStaffPick: false, // Default false, only admin can toggle
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

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        // Allow if user is author OR user is admin
        if (rec.userId !== identity.subject && user?.role !== "admin") {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.id);
    },
});

export const toggleStaffPick = mutation({
    args: { id: v.id("recommendations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user?.role !== "admin") {
            throw new Error("Only admins can toggle staff picks");
        }

        const rec = await ctx.db.get(args.id);
        if (!rec) throw new Error("Recommendation not found");

        await ctx.db.patch(args.id, {
            isStaffPick: !rec.isStaffPick,
        });
    },
});
