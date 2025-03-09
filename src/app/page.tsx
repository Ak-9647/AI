"use client";

import React, { useState } from "react";
import { RecipeForm } from "@/components/recipe-form";
import { ShoppingList } from "@/components/shopping-list";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"generate" | "lists">("generate");

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
            AI Shopping List Generator
          </h1>
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all shadow-sm hover:shadow">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="text-sm font-medium px-4 py-2 rounded-lg bg-green-50 text-green-600 border border-green-100">
                ✓ Signed in
              </div>
            </SignedIn>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-10">
          <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg max-w-md mx-auto shadow-sm">
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all ${
                activeTab === "generate"
                  ? "bg-white text-blue-600 shadow-sm font-medium"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 4V20M20 12H4" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span>Generate New List</span>
            </button>
            <button
              onClick={() => setActiveTab("lists")}
              className={`flex-1 py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-all ${
                activeTab === "lists"
                  ? "bg-white text-blue-600 shadow-sm font-medium"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <svg 
                className="w-5 h-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span>Your Shopping Lists</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === "generate" ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="xl:sticky xl:top-4 h-fit">
                <RecipeForm />
              </div>
              <div className="h-full">
                <ShoppingList />
              </div>
            </div>
          ) : (
            <ShoppingList fullWidth />
          )}
        </div>
      </div>
    </main>
  );
}
