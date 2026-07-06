"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

/**
 * 动态导入 ThemeProvider，禁用 SSR，避免：
 * 1. React 19 的 "Encountered a script tag" 警告
 * 2. next-themes 内联 script 的 hydration 问题
 */
const NextThemesProvider = dynamic(
  () => import("next-themes").then((mod) => mod.ThemeProvider),
  { ssr: false }
);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
