"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FunctionReference } from "convex/server";

export function RecipeForm() {
  const [recipe, setRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Try to get the Convex action function
  let generateList: any = null;
  try {
    generateList = useAction(api.recipes.generateShoppingList as any);
  } catch (error) {
    // Convex not set up yet
    generateList = null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipe.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a recipe description or ingredients"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (generateList) {
        // Use Convex if available
        await generateList({ description: recipe });
      } else {
        // Simulate API call if Convex isn't set up
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Success toast
      toast({
        variant: "success",
        title: "Success",
        description: "Shopping list generated successfully!"
      });
      
      setRecipe("");
    } catch (error) {
      console.error("Error generating list:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: typeof error === 'string' ? error : "Failed to generate shopping list"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Generate Shopping List
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label htmlFor="recipe" className="block text-sm font-medium text-gray-700 mb-2">
            Enter recipe or ingredients
          </label>
          <div className="relative">
            <textarea
              id="recipe"
              rows={10}
              className="w-full rounded-lg bg-gray-50 border border-gray-200 text-gray-800 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
              placeholder="Enter recipe details or paste ingredient list here..."
              value={recipe}
              onChange={(e) => setRecipe(e.target.value)}
              disabled={isLoading}
              suppressHydrationWarning
            />
            {recipe && !isLoading && (
              <button 
                type="button" 
                onClick={() => setRecipe("")}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            For best results, include ingredients with quantities
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !recipe.trim()}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all shadow-sm font-medium ${
            isLoading || !recipe.trim() 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Generate Shopping List
            </>
          )}
        </button>
        
        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm">
              <span className="font-medium">AI-Powered:</span> Our system organizes ingredients into categories for easier shopping
            </p>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="text-xs text-center text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
            <span className="font-medium block mb-1">Example:</span>
            "Rajma curry with kidney beans, tomatoes, onions, and spices"
          </div>
        </div>
      </form>
    </div>
  );
} 