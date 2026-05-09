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
        <MessageContent content={message.content} />
        {!isUser && isStreaming && message.content.length > 0 && (
          <span className="ml-0.5 inline-block animate-pulse text-indigo-400">▌</span>
        )}
        {!isUser && isStreaming && message.content.length === 0 && (
          <span className="inline-flex gap-1">
            <span className="size-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:0ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:150ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-indigo-300 [animation-delay:300ms]" />
          </span>
        )}
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  if (!content) return null;
  const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-gray-100 px-1 font-mono text-xs text-indigo-700"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
