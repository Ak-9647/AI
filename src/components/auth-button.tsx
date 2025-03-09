"use client";

import React from "react";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export function AuthButton() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex items-center">
      {isSignedIn ? (
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">
            Signed in as <span className="font-medium">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</span>
          </div>
          <SignOutButton>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      ) : (
        <SignInButton mode="modal">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded">
            Sign In
          </button>
        </SignInButton>
      )}
    </div>
  );
} 