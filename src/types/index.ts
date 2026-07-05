/**
 * @file Type definitions for the blog.
 */

export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  draft?: boolean;
  image?: string;
  author?: string;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  raw: string;
  readingTime: number;
  wordCount: number;
}

export interface SearchDocument {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
}

export interface CategoryInfo {
  name: string;
  count: number;
}

export interface TagInfo {
  name: string;
  count: number;
}
