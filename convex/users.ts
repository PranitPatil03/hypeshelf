import { mutation, query } from "./_generated/server";

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        // Check if we already have this user
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (user !== null) {
            // If we've seen this identity before but the name changed, update it.
            if (user.name !== identity.name || user.email !== identity.email) {
                await ctx.db.patch(user._id, {
                    name: identity.name || 'Anonymous',
                    email: identity.email || 'None',
                });
            }
            return user._id;
        }

        // Explicitly make the requested email an admin upon first login
        const role = identity.email === "patilpranit3112@gmail.com" ? "admin" : "user";

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
