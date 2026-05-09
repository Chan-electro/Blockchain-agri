import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/hooks/useChat";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2 px-3", isUser ? "flex-row-reverse" : "flex-row")}>
      {!isUser && (
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
          AI
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-indigo-600 text-white"
            : "rounded-tl-sm border bg-white text-gray-800 shadow-sm",
        )}
      >
        {isUser ? (
          <span>{message.content}</span>
        ) : (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock ? (
                    <pre className="mb-2 overflow-x-auto rounded-lg bg-gray-100 p-3 text-xs">
                      <code className="font-mono">{children}</code>
                    </pre>
                  ) : (
                    <code className="rounded bg-gray-100 px-1 font-mono text-xs text-indigo-700">
                      {children}
                    </code>
                  );
                },
                table: ({ children }) => (
                  <div className="mb-2 overflow-x-auto">
                    <table className="w-full border-collapse text-xs">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-indigo-50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-200 px-3 py-1.5 text-left font-semibold text-indigo-700">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-200 px-3 py-1.5">{children}</td>
                ),
                tr: ({ children }) => (
                  <tr className="even:bg-gray-50">{children}</tr>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mb-2 border-l-2 border-indigo-300 pl-3 text-gray-500 italic">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => <h1 className="mb-1 text-base font-bold">{children}</h1>,
                h2: ({ children }) => <h2 className="mb-1 text-sm font-bold">{children}</h2>,
                h3: ({ children }) => <h3 className="mb-1 text-sm font-semibold">{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && message.content.length > 0 && (
              <span className="ml-0.5 inline-block animate-pulse text-indigo-400">▌</span>
            )}
            {isStreaming && message.content.length === 0 && (
              <span className="inline-flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:0ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:150ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:300ms]" />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
