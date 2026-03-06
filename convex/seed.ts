import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const runSeed = mutation({
    args: {
        clear: v.boolean(),
        users: v.array(v.object({
            clerkId: v.string(),
            name: v.string(),
            email: v.string(),
            role: v.union(v.literal("user"), v.literal("admin")),
        })),
        recommendations: v.array(v.object({
            userId: v.string(),
            userName: v.string(),
            userAvatar: v.string(),
            title: v.string(),
            genre: v.string(),
            link: v.string(),
            blurb: v.string(),
            hypeScore: v.number(),
            isStaffPick: v.boolean(),
            posterUrl: v.string(),
        }))
    },
    handler: async (ctx, args) => {
        if (args.clear) {
            const recs = await ctx.db.query("recommendations").collect();
            for (const r of recs) {
                await ctx.db.delete(r._id);
            }

            const users = await ctx.db.query("users").collect();
            for (const u of users) {
                if (u.role !== 'admin') {
                    await ctx.db.delete(u._id);
                }
            }
        }

        for (const u of args.users) {
            await ctx.db.insert("users", u);
        }

        for (const r of args.recommendations) {
            await ctx.db.insert("recommendations", r);
        }

        return "Seeded successfully";
    }
});
