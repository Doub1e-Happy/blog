"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { SITE } from "@/lib/constants";

interface SearchDoc {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  content: string;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [results, setResults] = useState<SearchDoc[]>([]);

  // Ctrl+K or Cmd+K to open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Fetch index
  useEffect(() => {
    if (open && docs.length === 0) {
      fetch(`${SITE.basePath}/search-index.json`)
        .then((r) => r.json())
        .then(setDocs)
        .catch(() => {});
    }
  }, [open, docs.length]);

  // Search
  useEffect(() => {
    if (!query.trim() || docs.length === 0) {
      setResults([]);
      return;
    }
    const fuse = new Fuse(docs, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "description", weight: 0.25 },
        { name: "content", weight: 0.15 },
        { name: "category", weight: 0.1 },
        { name: "tags", weight: 0.1 },
      ],
      threshold: 0.3,
      minMatchCharLength: 2,
    });
    setResults(fuse.search(query.trim(), { limit: 10 }).map((r) => r.item));
  }, [query, docs]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      {/* Dialog */}
      <div className="fixed inset-x-0 top-[15%] z-50 mx-auto max-w-xl px-4">
        <div className="rounded-2xl border border-border bg-surface shadow-2xl">
          {/* Input */}
          <div className="flex items-center border-b border-border px-4">
            <svg
              className="mr-3 text-text-secondary/50"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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
              className="flex-1 border-none bg-transparent py-4 text-text outline-none placeholder:text-text-secondary/40"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-text-secondary/40">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-text-secondary">
                No results for &ldquo;{query}&rdquo;
              </div>
            )}
            {!query && (
              <div className="px-4 py-8 text-center text-sm text-text-secondary">
                Type to search posts by title, tag, or content
              </div>
            )}
            {results.map((doc) => (
              <Link
                key={doc.slug}
                href={`/blog/${doc.slug}`}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="block border-b border-border px-4 py-3 transition-colors hover:bg-bg-secondary last:border-0"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                    {doc.category}
                  </span>
                  <span className="text-xs text-text-secondary/50">
                    {new Date(doc.date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-text">{doc.title}</h4>
                <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                  {doc.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
