import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
    },

    handler: async (ctx, args) => {
        const indentity = await ctx.auth.getUserIdentity();
        if(!indentity){
            throw new Error('User not authenticated');
        }
        const userId = indentity.subject;
        const document = await ctx.db.insert("documents", {
            title: args.title,
            userId,
            parentDocument: args.parentDocument,
            isArchived: false,
            isPublished: false,
        })
        return document;
    }
})
