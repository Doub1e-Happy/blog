"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TITLES = [
  "V0idbit",
  "Security Researcher",
  "AI Explorer",
  "Full-Stack Developer",
];

export function TypewriterTitle() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = TITLES[titleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      // Typing
      if (displayed.length < currentTitle.length) {
        timeout = setTimeout(() => {
          setDisplayed(currentTitle.slice(0, displayed.length + 1));
        }, 80 + Math.random() * 40);
      } else {
        // Pause before deleting
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      // Deleting
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, 40);
      } else {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % TITLES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, titleIndex]);

  return (
    <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {displayed}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="ml-0.5 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] bg-primary"
        aria-hidden="true"
      />
    </h1>
  );
}
