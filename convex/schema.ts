import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    recommendations: defineTable({
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
    }).index("by_genre", ["genre"]).index("by_userId", ["userId"]),

    users: defineTable({
        clerkId: v.string(),
        role: v.union(v.literal("user"), v.literal("admin")),
        name: v.string(),
        email: v.string(),
    }).index("by_clerkId", ["clerkId"]),
});
