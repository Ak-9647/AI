"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ShoppingListProps {
  fullWidth?: boolean;
}

export function ShoppingList({ fullWidth = false }: ShoppingListProps) {
  // Try to fetch recipes, but handle the case where Convex isn't set up
  let recipes: any[] = [];
  try {
    recipes = useQuery(api.recipes.getUserRecipes as any) || [];
  } catch (error) {
    // Convex not set up yet
    recipes = [];
  }
  
  const hasRecipes = Array.isArray(recipes) && recipes.length > 0;

  if (hasRecipes) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 h-full overflow-auto ${fullWidth ? 'max-w-7xl mx-auto' : ''}`}>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Your Shopping Lists</h2>
        </div>
        
        {fullWidth ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {recipes.map((recipe: any) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {recipes.map((recipe: any) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default view when no recipes or Convex isn't set up
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 h-full ${fullWidth ? 'max-w-4xl mx-auto' : ''}`}>
      <div className="flex flex-col items-center justify-center h-full py-8">
        <div className="w-16 h-16 text-blue-300 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3">No Shopping Lists Yet</h3>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Complete Convex setup to enable full functionality and start creating AI-powered shopping lists.
        </p>
        
        <div className="bg-blue-50 rounded-lg p-6 w-full max-w-md">
          <h3 className="font-semibold text-blue-700 mb-4 text-center">Setup Instructions</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-sm">1</span>
                <span className="text-gray-700 font-medium">Run Convex Dev</span>
              </div>
              <div className="bg-gray-800 text-white p-2 rounded-md font-mono text-sm">
                npx convex dev
              </div>
            </div>
            
            <div className="flex items-center rounded-md px-4 py-3 bg-blue-50 border border-blue-100">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-sm">2</span>
              <span className="text-gray-700 font-medium">Select "create a new project" when prompted</span>
            </div>
            
            <div className="flex items-center rounded-md px-4 py-3 bg-blue-50 border border-blue-100">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-sm">3</span>
              <span className="text-gray-700 font-medium">Follow the authentication steps</span>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-sm">4</span>
                <span className="text-gray-700 font-medium">Add your Convex URL to the .env.local file</span>
              </div>
              <div className="bg-gray-800 text-white p-2 rounded-md font-mono text-sm">
                NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
              </div>
            </div>
            
            <div className="flex items-center rounded-md px-4 py-3 bg-blue-50 border border-blue-100">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-sm">5</span>
              <span className="text-gray-700 font-medium">Restart the development server</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Redesigned RecipeCard component for better organization
function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-100 bg-blue-50">
        <h3 className="font-medium text-lg text-gray-800 truncate">{recipe.description}</h3>
        <span className="text-xs text-gray-500 block mt-1">
          {new Date(recipe.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {recipe.shoppingList.map((category: any, idx: number) => (
            <div key={idx} className="pb-2">
              <div className="mb-2 pb-1 border-b border-blue-100">
                <h4 className="text-sm font-semibold text-blue-600">
                  {category.category}
                </h4>
              </div>
              <ul className="pl-2 pt-1">
                {category.items.map((item: string, itemIdx: number) => (
                  <li key={itemIdx} className="text-sm text-gray-700 flex items-start py-1 border-b border-gray-50 last:border-0">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
        <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit
        </button>
      </div>
    </div>
  );
} 