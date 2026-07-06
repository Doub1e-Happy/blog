"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // SSR 和首次渲染不输出日期/时间，避免 hydration mismatch
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-sm text-text-secondary">
        {mounted ? date : ""}
      </span>
      <span className={`font-mono text-2xl tabular-nums tracking-wider sm:text-3xl ${
        mounted
          ? "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          : "text-text-secondary"
      }`}>
        {mounted ? time : "--:--:--"}
      </span>
    </div>
  );
}
