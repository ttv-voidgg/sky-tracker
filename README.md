---
title: SkyTracker
description: A brief description of your repository that will appear in the blog card.
date: 2023-04-15
image: https://cdn-icons-png.freepik.com/512/2105/2105973.png
category: Development
author:
  name: Your Name
  role: Developer
  avatar: https://url-to-your-avatar.jpg
---

# Repository Name

Rest of your regular README content goes here...


# SkyTracker - Flight Tracking Application

SkyTracker is a real-time flight tracking application built with Next.js and Three.js. It allows users to search for flights by flight number and view detailed information about the flight, including departure and arrival times, flight status, and more.

## Features

- Real-time flight tracking
- 3D globe visualization
- Flight status information
- Departure and arrival details
- Aircraft information
- Mobile-responsive design

## Deployment on Vercel

### Prerequisites

- A Vercel account
- An AviationStack API key

### Steps to Deploy

1. Fork or clone this repository
2. Create a new project on Vercel
3. Connect your GitHub repository to Vercel
4. Add the following environment variable:
   - `AVIATIONSTACK_API_KEY`: Your AviationStack API key
5. Deploy the project

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fskytracker&env=AVIATIONSTACK_API_KEY&envDescription=API%20key%20for%20AviationStack%20flight%20data&envLink=https%3A%2F%2Faviationstack.com%2Fdocumentation)

## Local Development

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env.local` file with your AviationStack API key:
   \`\`\`
   AVIATIONSTACK_API_KEY=your_api_key_here
   \`\`\`
4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js
- React
- Three.js
- React Three Fiber
- Tailwind CSS
- shadcn/ui
- AviationStack API

## License

MIT
