import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.author.name}`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">About</h1>

      <div className="prose max-w-none">
        <div className="mb-10 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white shadow-lg shadow-primary/25">
            &gt;_
          </div>
          <div>
            <h2 className="text-2xl font-bold">{SITE.author.name}</h2>
            <p className="text-text-secondary">Software Developer</p>
          </div>
        </div>

        <p>
          I&apos;m a software developer who enjoys building things — from web
          applications to developer tools. This blog is where I document things I
          learn, problems I solve, and ideas I&apos;m exploring.
        </p>

        <h3>What I write about</h3>
        <ul>
          <li>Web development with React, Next.js, and TypeScript</li>
          <li>Developer tools and productivity</li>
          <li>Software architecture and patterns</li>
          <li>Tutorials and how-to guides</li>
        </ul>

        <h3>Tech stack for this blog</h3>
        <ul>
          <li>
            <strong>Framework:</strong> Next.js 16 (App Router, static export)
          </li>
          <li>
            <strong>Styling:</strong> Tailwind CSS v4 with custom theme tokens
          </li>
          <li>
            <strong>Content:</strong> MDX with custom components
          </li>
          <li>
            <strong>Search:</strong> Fuse.js (client-side fuzzy search)
          </li>
          <li>
            <strong>Comments:</strong> Giscus (GitHub Discussions)
          </li>
          <li>
            <strong>Fonts:</strong> Geist Sans + Geist Mono
          </li>
          <li>
            <strong>Hosting:</strong> GitHub Pages (free)
          </li>
        </ul>

        <h3>Contact</h3>
        <p>
          Find me on{" "}
          <a
            href={SITE.author.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          or reach out via{" "}
          <a href={`mailto:${SITE.author.email}`}>email</a>.
        </p>
      </div>
    </div>
  );
}
