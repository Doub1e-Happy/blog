import Link from "next/link";
import { getAllPosts, getRecentPosts } from "@/lib/posts";
import { CATEGORIES, SITE } from "@/lib/constants";
import { PostCard } from "@/components/blog/PostCard";
import type { Post } from "@/types";

export default function HomePage() {
  const recentPosts = getRecentPosts(3);
  const allPosts = getAllPosts();

  // Build tag cloud
  const tagCount: Record<string, number> = {};
  for (const post of allPosts) {
    for (const tag of post.frontmatter.tags) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }
  }
  const tags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* ── Hero ── */}
      <section className="pb-12 pt-6 text-center sm:pt-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white shadow-lg shadow-primary/25">
          &gt;_
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {SITE.title}
        </h1>
        <p className="mx-auto max-w-lg text-lg text-text-secondary">
          {SITE.description}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/blog"
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
          >
            Read the blog
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-primary hover:text-primary"
          >
            About me
          </Link>
        </div>
      </section>

      {/* ── Recent Posts ── */}
      {recentPosts.length > 0 && (
        <section className="py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent posts</h2>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* ── Categories ── */}
      <section className="py-8">
        <h2 className="mb-6 text-2xl font-bold">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const count = allPosts.filter(
              (p) => p.frontmatter.category === cat.slug,
            ).length;
            return (
              <Link
                key={cat.slug}
                href={`/blog/category/${cat.slug}`}
                className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5"
              >
                <h3 className="mb-1 font-semibold text-text transition-colors group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {cat.description}
                </p>
                <span className="mt-3 inline-block rounded-full bg-bg-secondary px-2.5 py-0.5 text-xs font-medium text-text-secondary">
                  {count} post{count !== 1 ? "s" : ""}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Tag Cloud ── */}
      {tags.length > 0 && (
        <section className="py-8">
          <h2 className="mb-6 text-2xl font-bold">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map(([tag, count]) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="rounded-lg bg-bg-secondary px-3 py-1.5 text-sm font-medium text-text-secondary transition-all hover:bg-primary/10 hover:text-primary"
              >
                {tag}
                <span className="ml-1 text-xs opacity-50">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
