/**
 * @file Post 内容渲染组件（MDX 自定义组件注入）
 * 使用 react-markdown 渲染 Markdown，并通过自定义组件注入图片 alt 处理。
 * 图片支持：本地 public/images/ 路径 或 外部 URL。
 * 用法示例：
 *   ![描述](/images/xxx.png)   → 本地图片（放在 public/images/）
 *   ![描述](https://...)        → 外部图片
 */

import type { Post } from "@/types";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const COMPONENTS: Components = {
  pre: ({ children, ...props }) => (
    <CodeBlock {...props}>{children}</CodeBlock>
  ),
  code: ({ children, className }) => {
    const language = className?.replace("language-", "") || "";
    if (!language) {
      return (
        <code className="rounded bg-code-bg px-1.5 py-0.5 text-sm font-mono">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  // 自定义图片渲染：支持点击放大
  img: ({ src, alt }) => {
    const srcStr = typeof src === "string" ? src : "";
    const altStr = typeof alt === "string" ? alt : "";
    return (
      <a href={srcStr} target="_blank" rel="noopener noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={srcStr}
          alt={altStr}
          className="rounded-xl border border-border shadow-lg transition-transform hover:scale-[1.02]"
          loading="lazy"
        />
      </a>
    );
  },
};

export function PostContent({ post }: { post: Post }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={COMPONENTS}
      >
        {post.content}
      </ReactMarkdown>
    </div>
  );
}
