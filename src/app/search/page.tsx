"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import type { SearchDocument } from "@/types";
import { SITE } from "@/lib/constants";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchDocument[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${SITE.basePath}/search-index.json`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setIndex(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const fuse = useMemo(() => {
    if (!index) return null;
    return new Fuse(index, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "description", weight: 0.2 },
        { name: "content", weight: 0.2 },
        { name: "category", weight: 0.1 },
        { name: "tags", weight: 0.1 },
      ],
      threshold: 0.3,
      minMatchCharLength: 2,
    });
  }, [index]);

  const results = useMemo(() => {
    if (!fuse || !query.trim()) return [];
    return fuse.search(query.trim()).map((r) => r.item).slice(0, 20);
  }, [fuse, query]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Search</h1>

      {/* Search input */}
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/50"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="9" cy="9" r="5" />
          <path d="M13 13l4 4" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          autoFocus
          className="w-full rounded-xl border border-border bg-surface py-3.5 pl-12 pr-4 text-text placeholder:text-text-secondary/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12 text-center text-text-secondary">
          Loading search index...
        </div>
      )}

      {/* No query */}
      {!loading && !query.trim() && (
        <div className="py-12 text-center text-text-secondary">
          <p className="text-lg font-medium">Type something to search</p>
          <p className="mt-1 text-sm">
            Search across post titles, descriptions, tags, and content
          </p>
        </div>
      )}

      {/* No results */}
      {!loading && query.trim() && results.length === 0 && (
        <div className="py-12 text-center text-text-secondary">
          <p className="text-lg font-medium">No results for &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm">Try a different search term</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {results.length} result{results.length !== 1 ? "s" : ""} for
            &ldquo;{query}&rdquo;
          </p>
          {results.map((doc) => {
            const date = new Date(doc.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <Link
                key={doc.slug}
                href={`/blog/${doc.slug}`}
                className="block rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase text-primary">
                    {doc.category}
                  </span>
                  <time
                    dateTime={doc.date}
                    className="text-xs text-text-secondary/50"
                  >
                    {date}
                  </time>
                </div>
                <h3 className="mb-1 text-lg font-semibold text-text group-hover:text-primary">
                  {doc.title}
                </h3>
                <p className="line-clamp-2 text-sm text-text-secondary">
                  {doc.description}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
