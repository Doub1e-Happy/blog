"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MiniCalendarProps {
  /** Dates that have posts, in "YYYY-MM-DD" format */
  postDates?: Set<string>;
}

export function MiniCalendar({ postDates }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    // Pad start (Sunday = 0)
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  }, [year, month]);

  const monthLabel = new Date(year, month).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
  });

  const prev = () => setCurrentDate(new Date(year, month - 1, 1));
  const next = () => setCurrentDate(new Date(year, month + 1, 1));

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={prev}
          className="rounded-md p-1 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-primary"
          aria-label="上月"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-text">{monthLabel}</span>
        <button
          onClick={next}
          className="rounded-md p-1 text-text-secondary transition-colors hover:bg-bg-secondary hover:text-primary"
          aria-label="下月"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>

      {/* Week days */}
      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center">
        {weekDays.map((d) => (
          <span key={d} className="text-[10px] font-medium text-text-secondary/70">
            {d}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-0.5 text-center"
        >
          {calendarDays.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = dateStr === today;
            const hasPost = postDates?.has(dateStr);

            return (
              <div
                key={dateStr}
                className={`relative flex h-7 items-center justify-center rounded-md text-xs transition-colors ${
                  isToday
                    ? "bg-primary font-bold text-white"
                    : "text-text hover:bg-bg-secondary"
                }`}
              >
                {day}
                {hasPost && !isToday && (
                  <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
