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
