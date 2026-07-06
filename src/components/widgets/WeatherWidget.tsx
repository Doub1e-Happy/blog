"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  temp: string;
  description: string;
  city: string;
  icon: string;
}

const WEATHER_ICONS: Record<string, React.ReactNode> = {
  sunny: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  cloudy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  ),
  rainy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      <path d="M8 22v-2M12 22v-4M16 22v-2" />
    </svg>
  ),
  snowy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      <path d="M8 22l1-2M12 22l1-3M16 22l1-2" />
    </svg>
  ),
  default: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
};

function getWeatherIcon(desc: string): string {
  const d = desc.toLowerCase();
  if (d.includes("sun") || d.includes("clear")) return "sunny";
  if (d.includes("rain") || d.includes("drizzle") || d.includes("shower")) return "rainy";
  if (d.includes("snow") || d.includes("ice") || d.includes("sleet")) return "snowy";
  if (d.includes("cloud") || d.includes("overcast") || d.includes("fog") || d.includes("mist") || d.includes("阴") || d.includes("云")) return "cloudy";
  return "default";
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 固定获取南京天气 (wttr.in, 无需 API key, 支持 CORS)
    fetch("https://wttr.in/Nanjing?format=j1&lang=zh", {
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        const current = data.current_condition?.[0];
        if (current) {
          // 优先使用中文描述
          const desc = current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || "";
          setWeather({
            temp: `${current.temp_C}°C`,
            description: desc,
            city: "南京",
            icon: getWeatherIcon(current.weatherDesc?.[0]?.value || desc),
          });
        }
      })
      .catch(() => setError(true));
  }, []);

  if (error || !weather) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary">
        <span className="text-primary">{WEATHER_ICONS.default}</span>
        <span>{error ? "天气获取失败" : "加载中…"}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm">
      <span className="text-primary">{WEATHER_ICONS[weather.icon] || WEATHER_ICONS.default}</span>
      <span className="font-medium text-text">{weather.temp}</span>
      <span className="text-text-secondary">·</span>
      <span className="text-text-secondary">{weather.city}</span>
      {weather.description && (
        <>
          <span className="text-text-secondary">·</span>
          <span className="text-text-secondary">{weather.description}</span>
        </>
      )}
    </div>
  );
}
