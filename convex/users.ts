import { mutation, query } from "./_generated/server";
import { isAdminEmail } from "./lib/admin";

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        const role = isAdminEmail(identity.email) ? "admin" : "user";

        if (user !== null) {
            if (user.name !== identity.name || user.email !== identity.email || user.role !== role) {
                await ctx.db.patch(user._id, {
                    name: identity.name || 'Anonymous',
                    email: identity.email || 'None',
                    role,
                });
            }
            return user._id;
        }

        return await ctx.db.insert("users", {
            clerkId: identity.subject,
            name: identity.name || 'Anonymous',
            email: identity.email || 'None',
            role,
        });
    },
});

export const current = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }
        return await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();
    },
});
