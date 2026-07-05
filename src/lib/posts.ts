/**
 * @file Post loading and querying utilities.
 * Uses fs + gray-matter to read .mdx files from content/blog/.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, Frontmatter, CategoryInfo, TagInfo } from "@/types";

const CONTENT_ROOT = path.join(process.cwd(), "content/blog");

/**
 * Recursively find all .mdx files under a directory.
 */
function findMdxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return findMdxFiles(full);
    if (entry.name.endsWith(".mdx")) return [full];
    return [];
  });
}

/**
 * Derive a URL-safe slug from a file path, preserving folder hierarchy.
 * e.g. content/blog/tech/my-post.mdx -> "tech/my-post"
 */
function slugFromPath(filePath: string): string {
  const rel = path.relative(CONTENT_ROOT, filePath);
  return rel.replace(/\.mdx?$/, "").replace(/\\/g, "/");
}

/**
 * Rough reading time in minutes (average 200 words/min).
 */
function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Parse a single post file.
 */
function parsePost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const wordCount = content.trim().split(/\s+/).length;

  return {
    slug: slugFromPath(filePath),
    frontmatter: {
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      updated: data.updated ? new Date(data.updated).toISOString() : undefined,
      category: data.category || "uncategorized",
      tags: data.tags || [],
      draft: data.draft === true,
      image: data.image || undefined,
      author: data.author || undefined,
    },
    content,
    raw,
    readingTime: readingTime(content),
    wordCount,
  };
}

/**
 * Get all published posts, sorted by date descending.
 */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  const files = findMdxFiles(CONTENT_ROOT);
  return files
    .map(parsePost)
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

/**
 * Get a single post by slug (with optional draft inclusion for admin).
 */
export function getPostBySlug(
  slug: string,
  includeDrafts = false,
): Post | null {
  const filePath = path.join(CONTENT_ROOT, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const post = parsePost(filePath);
  if (post.frontmatter.draft && !includeDrafts) return null;
  return post;
}

/**
 * Get all posts for a given category.
 */
export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(
    (p) => p.frontmatter.category.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * Get all posts for a given tag.
 */
export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) =>
    p.frontmatter.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

/**
 * Get all unique categories with post counts.
 */
export function getAllCategories(): CategoryInfo[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  for (const p of posts) {
    const cat = p.frontmatter.category.toLowerCase();
    map.set(cat, (map.get(cat) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all unique tags with post counts.
 */
export function getAllTags(): TagInfo[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const tag of p.frontmatter.tags) {
      const key = tag.toLowerCase();
      map.set(key, (map.get(key) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all slugs for static param generation.
 */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/**
 * Get recent posts.
 */
export function getRecentPosts(count = 5): Post[] {
  return getAllPosts().slice(0, count);
}
