import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-32 text-center">
      <div className="mb-6 text-8xl font-bold text-text-secondary/20">404</div>
      <h1 className="mb-4 text-2xl font-bold">Page not found</h1>
      <p className="mb-8 text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
        >
          Go home
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:border-primary hover:text-primary"
        >
          Browse posts
        </Link>
      </div>
    </div>
  );
}
