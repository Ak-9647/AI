import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Schema for the shopping list application
 * 
 * recipes: Stores recipe descriptions and their corresponding shopping lists
 */
export default defineSchema({
  recipes: defineTable({
    // User ID from authentication provider (Clerk)
    userId: v.string(),
    
    // Recipe or meal description provided by the user
    description: v.string(),
    
    // Shopping list categories and items, generated by AI
    shoppingList: v.array(
      v.object({
        category: v.string(),
        items: v.array(v.string()),
      })
    ),
    
    // Creation timestamp
    createdAt: v.number(),
  }),
}); 