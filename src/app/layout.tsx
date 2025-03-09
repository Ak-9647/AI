"use client";

import * as React from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

// Only initialize Convex if the URL is available
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

// Clerk publishable key fallback
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_ZXZvbHZlZC1hbnRlbG9wZS02Ny5jbGVyay5hY2NvdW50cy5kZXYk";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if Convex URL is configured
  const isConvexConfigured = !!convexUrl && !!convex;

  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <ClerkProvider publishableKey={clerkPubKey}>
          {isConvexConfigured ? (
            <ConvexProviderWithClerk client={convex!} useAuth={useAuth}>
              <div className="mx-auto max-w-screen-xl px-4">
                {children}
                <Toaster />
              </div>
            </ConvexProviderWithClerk>
          ) : (
            <>
              <div className="mx-auto max-w-screen-xl px-4">
                {children}
                <Toaster />
                <div className="fixed bottom-0 left-0 right-0 bg-amber-800 p-4 text-white text-center flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Convex URL not configured</span>
                  <span className="mx-2">|</span>
                  <span>Run <code className="bg-amber-900 px-2 py-0.5 rounded font-mono">npx convex dev</code> and add the URL to .env.local</span>
                </div>
              </div>
            </>
          )}
        </ClerkProvider>
      </body>
    </html>
  );
}
