import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTrash = query({
  handler: async (ctx) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("User not authenticated");
    }
    const userId = indentity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .collect();
    return documents;
  },
});

export const restore = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("User not authenticated");
    }
    const userId = indentity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not Found");
    }
    if (existingDocument.userId != userId) {
      throw new Error("Unauthorized!!");
    }

    // Recursively getting/restoring all the children of the note.
    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (const child of children) {
        await recursiveRestore(child._id);
      }
    };
    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };
    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }
    const document = await ctx.db.patch(args.id, options);
    recursiveRestore(args.id);

    return document;
  },
});

export const archived = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("User not authenticated");
    }
    const userId = indentity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not Found");
    }
    if (existingDocument.userId != userId) {
      throw new Error("Unauthorized!!");
    }
    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId),
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
      }
    };
    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    recursiveArchive(args.id);
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("User not authenticated");
    }
    const userId = indentity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument),
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },

  handler: async (ctx, args) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("User not authenticated");
    }
    const userId = indentity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      userId,
      parentDocument: args.parentDocument,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const remove = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("User not authenticated");
    }
    const userId = indentity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not Found");
    }
    if (existingDocument.userId != userId) {
      throw new Error("Unauthorized!!");
    }
    await ctx.db.delete(args.id);
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("User not authenticated");
    }
    const userId = indentity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();
    return documents;
  },
});

export const dropAll = mutation({
  handler: async (ctx) => {
    const indentity = await ctx.auth.getUserIdentity();
    if (!indentity) {
      throw new Error("User not authenticated");
    }
    const userId = indentity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const document of documents) {
      await ctx.db.delete(document._id);
    }
  },
});
