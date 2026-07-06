"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    if (glowRef.current) {
      glowRef.current.style.left = "0px";
      glowRef.current.style.top = "0px";

      const unsubX = springX.on("change", (v) => {
        if (glowRef.current) glowRef.current.style.transform = `translate(${v - 150}px, ${springY.get() - 150}px)`;
      });
      const unsubY = springY.on("change", (v) => {
        if (glowRef.current) glowRef.current.style.transform = `translate(${springX.get() - 150}px, ${v - 150}px)`;
      });

      return () => {
        window.removeEventListener("mousemove", onMove);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        unsubX();
        unsubY();
      };
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y, springX, springY]);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed z-0 h-[300px] w-[300px] opacity-60 dark:opacity-100"
      style={{
        background:
          "radial-gradient(circle, oklch(0.55 0.22 265 / 0.06) 0%, transparent 70%)",
        transition: "opacity 0.3s ease",
      }}
    />
  );
}
