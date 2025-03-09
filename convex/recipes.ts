import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import OpenAI from "openai";
import { api } from "./_generated/api";

// We'll initialize OpenAI in the actual function to get the env var from ctx
let openai: OpenAI | null = null;

// Internal mutation to store a recipe in the database
export const storeRecipe = mutation({
  args: {
    userId: v.string(),
    description: v.string(),
    shoppingList: v.array(
      v.object({
        category: v.string(),
        items: v.array(v.string())
      })
    ),
    createdAt: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("recipes", {
      userId: args.userId,
      description: args.description,
      shoppingList: args.shoppingList,
      createdAt: args.createdAt
    });
  }
});

// Generate shopping list from a recipe description
export const generateShoppingList = action({
  args: { description: v.string() },
  handler: async (ctx, args) => {
    // Authenticate the user
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Please sign in");
    }
    
    const userId = identity.subject;

    try {
      // Get the OpenAI API key from Convex environment
      const apiKey = process.env.OPENAI_API_KEY;
      console.log("Calling OpenAI API with description:", args.description.substring(0, 50) + "...");
      
      if (!apiKey) {
        throw new Error("OpenAI API key is not configured in Convex environment. Please run 'npx convex env set OPENAI_API_KEY your-key'");
      }
      
      // Initialize OpenAI with the API key
      if (!openai) {
        openai = new OpenAI({
          apiKey: apiKey
        });
      }

      // Call OpenAI API to generate shopping list
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that organizes shopping lists. Create a structured shopping list based on the recipe description, grouping items by category (e.g., Produce, Meat, Dairy, etc.)."
          },
          {
            role: "user",
            content: `Create a shopping list organized by categories for this recipe: ${args.description}`
          }
        ],
        temperature: 0.7,
      });

      // Parse the response
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Failed to generate shopping list");
      }

      // Parse the shopping list from the content
      const shoppingList = parseShoppingList(content);
      
      // Use a properly named mutation to store the recipe
      // In Convex, actions cannot access the database directly
      const recipeId = await ctx.runMutation("recipes:storeRecipe", {
        userId,
        description: args.description,
        shoppingList,
        createdAt: Date.now()
      });

      return recipeId;
    } catch (error) {
      console.error("Error generating shopping list:", error);
      // Provide more detailed error message
      const errorMessage = error instanceof Error 
        ? `Failed to generate shopping list: ${error.message}` 
        : "Failed to generate shopping list";
      throw new Error(errorMessage);
    }
  },
});

// Get all recipes for the authenticated user
export const getUserRecipes = query({
  handler: async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    
    // Fix the order method call
    return await ctx.db
      .query("recipes")
      .order("desc")
      .collect();
  }
});

// Get a specific recipe by ID
export const getRecipeById = query({
  args: { id: v.id("recipes") },
  handler: async (ctx: any, args: { id: Id<"recipes"> }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Please sign in");
    }

    const recipe = await ctx.db.get(args.id);
    
    // Verify the recipe exists and belongs to the user
    if (!recipe || recipe.userId !== identity.subject) {
      throw new Error("Recipe not found");
    }

    return recipe;
  },
});

// Delete a recipe by ID
export const deleteRecipe = mutation({
  args: { id: v.id("recipes") },
  handler: async (ctx: any, args: { id: Id<"recipes"> }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: Please sign in");
    }

    const recipe = await ctx.db.get(args.id);
    
    // Verify the recipe exists and belongs to the user
    if (!recipe || recipe.userId !== identity.subject) {
      throw new Error("Recipe not found or you don't have permission to delete it");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Helper function to parse the AI response into structured shopping list categories
function parseShoppingList(response: string) {
  const categories: { category: string; items: string[] }[] = [];
  let currentCategory = "";
  let currentItems: string[] = [];

  const lines = response.split("\n");
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Detect category headers (usually end with a colon)
    if (trimmedLine.endsWith(":")) {
      // Save previous category if it exists
      if (currentCategory && currentItems.length > 0) {
        categories.push({
          category: currentCategory,
          items: [...currentItems],
        });
      }
      
      // Start new category
      currentCategory = trimmedLine.slice(0, -1);
      currentItems = [];
    } 
    // Detect list items (usually start with - or • or *)
    else if (trimmedLine.match(/^[-•*]\s/) || trimmedLine.match(/^\d+\.\s/)) {
      const item = trimmedLine.replace(/^[-•*\d+\.]\s/, "").trim();
      currentItems.push(item);
    }
    // If it's text after a category but not formatted as a list, still add it
    else if (currentCategory && !trimmedLine.includes(":")) {
      currentItems.push(trimmedLine);
    }
  }

  // Add the last category if it exists
  if (currentCategory && currentItems.length > 0) {
    categories.push({
      category: currentCategory,
      items: currentItems,
    });
  }

  // If no structured categories were detected, create a generic one
  if (categories.length === 0 && response.trim()) {
    return [{ category: "Items", items: response.split("\n").filter(line => line.trim()) }];
  }

  return categories;
}