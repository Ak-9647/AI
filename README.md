# AI Shopping List Generator

An AI-powered shopping list generator built with Next.js, Convex, and Clerk authentication.

## Overview

This application allows you to generate organized shopping lists from recipe descriptions using AI. It categorizes ingredients and creates a structured, easy-to-use shopping list.

## Features

- AI-powered ingredient organization
- Beautiful modern UI
- User authentication with Clerk
- Real-time updates with Convex backend
- Responsive design

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You'll also need to run the Convex development server:

```bash
npx convex dev
```

### Environment Setup

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Convex](https://www.convex.dev/) - Backend database and API
- [Clerk](https://clerk.com/) - Authentication
- [OpenAI API](https://openai.com/) - AI-powered list generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Deployment

The easiest way to deploy the Next.js frontend is to use [Vercel](https://vercel.com/).
