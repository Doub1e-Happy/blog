"use client";

import { useState } from "react";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  // Check session storage on mount
  // This is a simple auth — for a real deployment, use a proper auth mechanism.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin password — set via ADMIN_PASSWORD env or use a default for dev
    const adminPassword =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_password") || "admin123"
        : "admin123";

    if (password === adminPassword) {
      setAuthenticated(true);
      localStorage.setItem("admin_authed", "true");
    } else {
      setError(true);
    }
  };

  // Check if already auth'd
  if (!authenticated) {
    const alreadyAuth =
      typeof window !== "undefined" &&
      localStorage.getItem("admin_authed") === "true";
    if (alreadyAuth) {
      return <>{children}</>;
    }
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex max-w-sm items-center justify-center px-4 py-32">
      <div className="w-full">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            🔐
          </div>
          <h2 className="text-xl font-bold">Admin Login</h2>
          <p className="mt-1 text-sm text-text-secondary">
            Enter the admin password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-secondary/40 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-500">Incorrect password</p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
