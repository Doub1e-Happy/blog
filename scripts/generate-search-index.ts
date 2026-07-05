import { getAllPosts } from "../src/lib/posts";
import fs from "fs";
import path from "path";
import type { SearchDocument } from "../src/types";

/**
 * Build-time script: generates a search index JSON file at public/search-index.json.
 * Run with: npx tsx scripts/generate-search-index.ts
 */
function generateSearchIndex() {
  const posts = getAllPosts();
  const docs: SearchDocument[] = posts.map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    date: post.frontmatter.date,
    category: post.frontmatter.category,
    tags: post.frontmatter.tags,
    content: post.content,
  }));

  const outDir = path.join(process.cwd(), "public");
  const outFile = path.join(outDir, "search-index.json");

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outFile, JSON.stringify(docs), "utf-8");
  console.log(`✓ Search index written to public/search-index.json (${docs.length} documents)`);
}

generateSearchIndex();
