"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate } from "framer-motion";

const COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "oklch(0.7 0.18 300)",
  "oklch(0.75 0.2 80)",
];

export function ClickParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnParticles = useCallback((x: number, y: number) => {
    const container = containerRef.current;
    if (!container) return;

    const count = 8 + Math.floor(Math.random() * 5); // 8-12 particles

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const size = 2 + Math.random() * 4;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 30 + Math.random() * 60;

      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
      `;

      container.appendChild(el);

      animate(
        el,
        {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0,
        },
        {
          duration: 0.4 + Math.random() * 0.3,
          ease: "easeOut",
          onComplete: () => el.remove(),
        }
      );
    }
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      spawnParticles(e.clientX, e.clientY);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [spawnParticles]);

  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-[9999]" />;
}
