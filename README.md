# SOS Training Manual

Biblical training materials for church planting and evangelism. A mobile-first lesson reader built for missionaries to access on the go.

**Live site:** [lesson.sos-missions.com](https://lesson.sos-missions.com)

## Features

- Mobile-first responsive design
- Bilingual support (English + Tagalog)
- Offline access via PWA
- Clean, readable lesson formatting with scripture blockquotes

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [MDX](https://mdxjs.com/) via next-mdx-remote
- Deployed on [Vercel](https://vercel.com/)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm start
```

## Content Structure

Lessons are organized under `content/` by locale:

```
content/
  en/           # English
  tl-ph/        # Tagalog
```

Each category folder contains MDX lesson files with frontmatter for title, position, and ordering.

## Deployment

Push to `main` — Vercel auto-deploys.
