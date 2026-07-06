"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QUOTES } from "@/lib/quotes";

export function DailyQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    );
    setQuote(QUOTES[dayOfYear % QUOTES.length]);
  }, []);

  // 未挂载时不渲染，避免 hydration mismatch
  if (!quote) {
    return (
      <div className="mx-auto max-w-lg">
        <blockquote className="relative border-l-2 border-primary pl-4 py-1">
          <p className="text-sm italic leading-relaxed text-text">&nbsp;</p>
        </blockquote>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mx-auto max-w-lg"
    >
      <blockquote className="relative border-l-2 border-primary pl-4 py-1">
        <p className="text-sm italic leading-relaxed text-text">
          &ldquo;{quote.text}&rdquo;
        </p>
        <footer className="mt-1 text-xs text-text-secondary">
          — {quote.author}
        </footer>
      </blockquote>
    </motion.div>
  );
}
