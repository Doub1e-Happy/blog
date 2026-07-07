/**
 * @file 站点全局常量
 */

export const SITE = {
  title: "voidbit",
  description: "Agent与安全 — 渗透测试、Web安全、流量分析、Agent for Sec、记录思考。",
  url: "https://voidbit147.github.io/blog",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  author: {
    name: "voidbit",
    github: "https://github.com/voidbit147",
    email: "voidbit147@users.noreply.github.com",
  },
  postsPerPage: 6,
} as const;

export const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/search", label: "搜索" },
  { href: "/about", label: "关于" },
] as const;

export const CATEGORIES = [
  { slug: "tech", name: "技术", description: "编程、架构与工具的深度探索。" },
  { slug: "tutorials", name: "教程", description: "手把手的实战指南与踩坑记录。" },
  { slug: "life", name: "生活", description: "随笔、感悟，以及代码之外的思考。" },
  { slug: "algorithm", name: "算法", description: "数据结构、算法题解与思路总结。" },
  { slug: "interview", name: "面经", description: "面试题目、流程与复盘经验。" },
] as const;

export const GISCUS = {
  repo: "voidbit147/blog",
  repoId: "R_kgDOO-----------",
  category: "Announcements",
  categoryId: "DIC_kwDOO-----------",
  mapping: "pathname" as const,
  reactionsEnabled: "1" as const,
  theme: "preferred_color_scheme" as const,
};
