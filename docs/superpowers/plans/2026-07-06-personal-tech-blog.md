# Personal Tech Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully static personal tech blog with rich MDX content, online editing, full-text search, and GitHub Pages deployment.

**Architecture:** Next.js 16 App Router with `output: 'export'` for fully static deployment. Content lives as MDX files in `content/` directories. Build-time scripts generate a search index (JSON), RSS feed, and sitemap. Framer Motion handles page transitions and scroll progress. A browser-based admin panel (unlocked via a short password, stored in `sessionStorage`) uses the GitHub API to commit edits directly to the repository, triggering a redeploy via GitHub Actions.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4.1, `@next/mdx` + `@mdx-js/react`, Framer Motion 12, fuse.js 7, `@giscus/react`, Shiki (via `rehype-pretty-code`), `gray-matter`, `feed` (RSS), `@atomic-editor/editor` (admin panel editor)

## Global Constraints

- `output: 'export'` in `next.config.ts` -- no server at all, no API routes
- All dynamic routes MUST provide `generateStaticParams`
- `images: { unoptimized: true }` required for static export
- `basePath` and `assetPrefix` set for GitHub Pages subpath (e.g., `/my-blog`) -- make configurable via env var
- Must include `.nojekyll` file in `public/` for GitHub Pages
- Tailwind CSS v4 uses `@import "tailwindcss"` in CSS, no `tailwind.config.js`
- All interactive components need `"use client"` directive
- Dark mode via `next-themes` with `class` strategy and `@custom-variant dark (&:where(.dark, .dark *))` in CSS
- Content files use `.mdx` extension with YAML frontmatter

---
## Complete Folder Structure

```
blog/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── .nojekyll
│   ├── images/
│   │   └── .gitkeep
│   ├── favicon.ico
│   └── og-default.png
├── content/
│   ├── blog/
│   │   ├── tech/
│   │   ├── life/
│   │   └── tutorials/
│   └── drafts/
│       └── .gitkeep
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── template.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   ├── globals.css
│   │   ├── blog/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   ├── category/[category]/page.tsx
│   │   │   └── tag/[tag]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── about/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── editor/page.tsx
│   │   │   └── posts/page.tsx
│   │   ├── feed.xml/route.ts
│   │   └── sitemap.xml/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── PostContent.tsx
│   │   │   ├── CategoryBadge.tsx
│   │   │   ├── TagCloud.tsx
│   │   │   └── NewsletterSignup.tsx
│   │   ├── mdx/
│   │   │   ├── Callout.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── MermaidDiagram.tsx
│   │   │   ├── EmbedTweet.tsx
│   │   │   └── TableOfContents.tsx
│   │   ├── search/
│   │   │   ├── SearchInput.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── BackToTop.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Pagination.tsx
│   │   ├── admin/
│   │   │   ├── AuthGate.tsx
│   │   │   ├── Editor.tsx
│   │   │   ├── EditorToolbar.tsx
│   │   │   ├── PostManager.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── FrontmatterForm.tsx
│   │   └── comments/
│   │       └── GiscusComments.tsx
│   ├── lib/
│   │   ├── posts.ts
│   │   ├── search.ts
│   │   ├── rss.ts
│   │   ├── sitemap.ts
│   │   ├── github.ts
│   │   ├── storage.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       ├── useSearch.ts
│       ├── useTheme.ts
│       └── usePosts.ts
├── scripts/
│   ├── generate-search-index.ts
│   ├── generate-rss.ts
│   └── scaffold-post.ts
├── mdx-components.tsx
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── .env.local.example
```

## Admin Panel Decision: Hybrid Approach

After evaluating the three options:

| Option | Pros | Cons |
|---|---|---|
| **A: Dev-mode only** | Simplest, no auth, instant saves | Cannot edit from live site |
| **B: GitHub API** | Edit from any browser, triggers redeploy | Requires GitHub token, rate limits |
| **C: Headless CMS** | Full CMS features, media management | Complexity, vendor lock-in, cost |

**Recommendation: Option A (dev-mode) as primary, with Option B (GitHub API) as opt-in.**

The admin panel uses a pluggable StorageBackend interface. Default backend writes to local filesystem (dev only). Optional backend uses GitHub API to commit directly.
## All npm Dependencies



**Package selection rationale:**

- **@atomic-editor/editor** over pd-editor-react and neo-md: Obsidian-style live inline preview, raw markdown source of truth, virtualized rendering for large posts, MIT-licensed. Both pd-editor-react and atomic-editor support image paste; fall back to pd-editor-react if atomic-editor proves unstable (v0.4.3 as of mid-2026).
- **Shiki via rehype-pretty-code** for syntax highlighting: build-time highlighting, zero JS bundle cost, VS Code-quality theming. rehype-prism-plus would add ~15KB client JS.
- **fuse.js v7**: improved TypeScript types, better default scoring over v6.
- **feed** for RSS: standard package supporting RSS 2.0 and Atom.
- **Tailwind CSS v4** uses CSS-first config: no tailwind.config.ts, everything in globals.css via @theme.

