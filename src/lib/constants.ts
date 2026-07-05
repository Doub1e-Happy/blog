/**
 * @file Site-wide constants.
 */

export const SITE = {
  title: "devLog",
  description: "A personal tech blog about web development, systems, and creative coding.",
  url: "https://doub1e-happy.github.io/blog",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  author: {
    name: "V0idbit",
    github: "https://github.com/Doub1e-Happy",
    email: "31293@users.noreply.github.com",
  },
  postsPerPage: 6,
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
] as const;

export const CATEGORIES = [
  { slug: "tech", name: "Tech", description: "Deep dives into programming, architecture, and tools." },
  { slug: "tutorials", name: "Tutorials", description: "Step-by-step guides and how-tos." },
  { slug: "life", name: "Life", description: "Thoughts, experiences, and everything in between." },
] as const;

export const GISCUS = {
  repo: "Doub1e-Happy/blog",
  repoId: "R_kgDOO-----------",
  category: "Announcements",
  categoryId: "DIC_kwDOO-----------",
  mapping: "pathname" as const,
  reactionsEnabled: "1" as const,
  theme: "preferred_color_scheme" as const,
};
