import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { isAdminEmail } from "./lib/admin";

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
            // Determine the correct role based on ADMIN_EMAILS env var
            const role = isAdminEmail(u.email) ? "admin" : u.role;

            const existing = await ctx.db
                .query("users")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", u.clerkId))
                .unique();
            if (!existing) {
                await ctx.db.insert("users", { ...u, role });
            } else if (existing.role !== role) {
                // Update role if it changed (e.g. user should now be admin)
                await ctx.db.patch(existing._id, { role });
            }
        }

        for (const r of args.recommendations) {
            await ctx.db.insert("recommendations", r);
        }

        return "Seeded successfully";
    }
});
