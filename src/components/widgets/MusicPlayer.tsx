"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
  title: string;
  artist: string;
  src: string;
}

/**
 * 音乐列表 - 使用公开免费音乐
 * 可替换为本地 public/music/ 目录下的文件
 */
const PLAYLIST: Track[] = [
  {
    title: "Chill Vibes",
    artist: "Ambient",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    title: "Deep Focus",
    artist: "Lo-Fi",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    title: "Night Code",
    artist: "Electronic",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // 使用 ref 追踪当前 index 避免闭包陷阱
  const indexRef = useRef(currentIndex);

  // 保持 ref 和 state 同步
  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  const currentTrack = PLAYLIST[currentIndex];

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const onEnded = () => {
      // 使用 ref 获取最新 index，避免闭包陷阱
      const next = (indexRef.current + 1) % PLAYLIST.length;
      indexRef.current = next;
      setCurrentIndex(next);
      audio.src = PLAYLIST[next].src;
      audio.load();
      audio.play().catch(() => {});
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
    };
  }, []);

  const loadTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = PLAYLIST[index].src;
    audio.load();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (!audio.src || audio.src === window.location.href) {
        loadTrack(currentIndex);
      }
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentIndex, loadTrack]);

  const playNext = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = (currentIndex + 1) % PLAYLIST.length;
    setCurrentIndex(next);
    loadTrack(next);
    audio.play().catch(() => {});
    setIsPlaying(true);
  }, [currentIndex, loadTrack]);

  const playPrev = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const prev = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentIndex(prev);
    loadTrack(prev);
    audio.play().catch(() => {});
    setIsPlaying(true);
  }, [currentIndex, loadTrack]);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  }, []);

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* 浮动按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-20 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-text-secondary shadow-lg transition-colors hover:border-primary hover:text-primary"
        aria-label="Music player"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
        >
          <path d="M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM21 16c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
        </motion.svg>
      </motion.button>

      {/* 展开的播放器面板 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 w-72 rounded-xl border border-border bg-surface p-4 shadow-xl"
          >
            {/* 曲目信息 */}
            <div className="mb-3">
              <p className="truncate text-sm font-semibold text-text">
                {currentTrack.title}
              </p>
              <p className="text-xs text-text-secondary">{currentTrack.artist}</p>
            </div>

            {/* 进度条 */}
            <div
              className="mb-2 h-1.5 cursor-pointer rounded-full bg-bg-secondary"
              onClick={seek}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mb-3 flex justify-between text-[10px] text-text-secondary/60">
              <span>
                {formatTime(
                  audioRef.current
                    ? (progress / 100) * (audioRef.current.duration || 0)
                    : 0
                )}
              </span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* 控制按钮 */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={playPrev}
                className="rounded-full p-1.5 text-text-secondary transition-colors hover:text-primary"
                aria-label="Previous"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={playNext}
                className="rounded-full p-1.5 text-text-secondary transition-colors hover:text-primary"
                aria-label="Next"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {/* 播放列表 */}
            <div className="mt-3 border-t border-border pt-3">
              {PLAYLIST.map((track, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    loadTrack(i);
                    audioRef.current?.play().catch(() => {});
                    setIsPlaying(true);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                    i === currentIndex
                      ? "bg-primary/10 text-primary"
                      : "text-text-secondary hover:bg-bg-secondary hover:text-text"
                  }`}
                >
                  <span className="w-4 text-center font-mono text-[10px] opacity-50">
                    {i + 1}
                  </span>
                  <span className="truncate">{track.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
