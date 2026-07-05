import Link from "next/link";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary/50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-text transition-colors hover:text-primary"
            >
              <span className="text-primary">&gt;</span> {SITE.title}
            </Link>
            <p className="mt-2 text-sm text-text-secondary">
              {SITE.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text">Links</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="/blog"
                className="text-text-secondary transition-colors hover:text-primary"
              >
                Blog
              </Link>
              <Link
                href="/search"
                className="text-text-secondary transition-colors hover:text-primary"
              >
                Search
              </Link>
              <Link
                href="/about"
                className="text-text-secondary transition-colors hover:text-primary"
              >
                About
              </Link>
              <Link
                href="/feed.xml"
                className="text-text-secondary transition-colors hover:text-primary"
              >
                RSS Feed
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text">Elsewhere</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={SITE.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-primary"
              >
                GitHub
              </a>
              <a
                href={`mailto:${SITE.author.email}`}
                className="text-text-secondary transition-colors hover:text-primary"
              >
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-text-secondary">
          <p>
            &copy; {new Date().getFullYear()} {SITE.author.name}. Built with
            Next.js &amp; deployed on GitHub Pages.
          </p>
        </div>
      </div>
    </footer>
  );
}
