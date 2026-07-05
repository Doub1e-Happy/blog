import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="/admin/editor"
          className="rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="mb-2 text-2xl">✍️</div>
          <h3 className="mb-1 font-semibold">New Post</h3>
          <p className="text-sm text-text-secondary">
            Write and publish a new blog post
          </p>
        </a>
        <a
          href="/admin/posts"
          className="rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="mb-2 text-2xl">📋</div>
          <h3 className="mb-1 font-semibold">Manage Posts</h3>
          <p className="text-sm text-text-secondary">
            View, edit, or delete existing posts
          </p>
        </a>
      </div>
    </div>
  );
}
