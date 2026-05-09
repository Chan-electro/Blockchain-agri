import { useEffect, useRef } from "react";
import { X, Trash2, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { useChatSidebar } from "@/providers/ChatProvider";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  FARMER: [
    "What is the status of my latest batch?",
    "Which batches are still being processed?",
    "What is the average price across all my crops?",
  ],
  PROCESSOR: [
    "Which batches are waiting to be processed?",
    "What fees have been added by processors?",
    "Show me recently processed batches.",
  ],
  LOGISTICS: [
    "Which batches are currently in transit?",
    "What are the transport fees across all batches?",
    "Show batches waiting for logistics.",
  ],
  RETAILER: [
    "Which batches are at retail stage?",
    "What is the retail markup on recent batches?",
    "Show batches ready for consumers.",
  ],
  ADMIN: [
    "How many batches are in each status?",
    "Which crop type has the highest total value?",
    "Show the full supply chain for batch #1.",
  ],
  DEFAULT: [
    "Where did this product come from?",
    "What is the full supply chain for batch #1?",
    "What crops are currently available?",
  ],
};

export function ChatSidebar() {
  const { isOpen, close } = useChatSidebar();
  const { messages, isStreaming, error, sendMessage, clear } = useChat();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions =
    user
      ? (ROLE_SUGGESTIONS[user.role] ?? ROLE_SUGGESTIONS.DEFAULT)
      : ROLE_SUGGESTIONS.DEFAULT;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[380px] max-w-[100vw] flex-col",
          "border-l bg-gray-50 shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-white px-4 py-3.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sprout className="size-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">AgriChain AI</p>
            <p className="text-[10px] text-gray-400">
              {user
                ? `${user.role} · ${user.email}`
                : "Public · not signed in"}
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clear}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Clear chat"
            >
              <Trash2 className="size-4" />
            </button>
          )}
          <button
            onClick={close}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
          {messages.length === 0 ? (
            <EmptyState suggestions={suggestions} onSend={sendMessage} />
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  message={msg}
                  isStreaming={
                    isStreaming &&
                    i === messages.length - 1 &&
                    msg.role === "assistant"
                  }
                />
              ))}
            </div>
          )}
          {error && (
            <p className="mx-3 mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </aside>
    </>
  );
}

function EmptyState({
  suggestions,
  onSend,
}: {
  suggestions: string[];
  onSend: (text: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 pt-6">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-100">
        <Sprout className="size-7 text-indigo-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-800">Ask AgriChain AI</p>
        <p className="mt-0.5 text-xs text-gray-400">
          Questions about batches, prices, supply chain, or agriculture
        </p>
      </div>
      <div className="w-full space-y-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSend(s)}
            className="w-full rounded-xl border bg-white px-3.5 py-2.5 text-left text-xs text-gray-600 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
