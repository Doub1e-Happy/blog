"use client";

import { useState } from "react";

interface CodeBlockProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  // Extract the code from children
  let code = "";
  let language = "";

  if (children) {
    const child = children as { props?: { children?: string; className?: string } };
    code = child?.props?.children || "";
    language = child?.props?.className?.replace("language-", "") || "";
  }

  const lines = code.split("\n").length;
  const showLines = code.length > 200 || lines > 3;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  const preClassName = [
    "overflow-x-auto rounded-b-xl border border-border bg-code-bg p-4 text-sm leading-relaxed font-mono",
    typeof className === "string" ? className : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="code-block-wrapper group my-6">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-t-xl border border-border border-b-0 bg-bg-secondary px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          {language && (
            <span className="ml-2 text-xs font-medium text-text-secondary/60">
              {language}
            </span>
          )}
        </div>
        {showLines && (
          <span className="text-xs text-text-secondary/40">
            {lines} lines
          </span>
        )}
      </div>

      {/* Code */}
      <div className="relative">
        <pre className={preClassName} {...props}>
          {children}
        </pre>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="copy-btn flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary"
        >
          {copied ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 6l-8.5 8.5L4 11" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="7" y="7" width="10" height="10" rx="1.5" />
                <path d="M13 4.5V3a1.5 1.5 0 0 0-1.5-1.5h-7A1.5 1.5 0 0 0 3 3v7A1.5 1.5 0 0 0 4.5 11.5h1.5" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}
