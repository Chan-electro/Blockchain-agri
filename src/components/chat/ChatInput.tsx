import { useCallback, useRef, type KeyboardEvent } from "react";
import { SendHorizonal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const submit = useCallback(() => {
    const val = ref.current?.value.trim();
    if (!val || disabled) return;
    onSend(val);
    if (ref.current) {
      ref.current.value = "";
      ref.current.style.height = "auto";
    }
  }, [onSend, disabled]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  const onInput = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, 120)}px`;
  }, []);

  return (
    <div className="flex items-end gap-2 border-t bg-white p-3">
      <textarea
        ref={ref}
        rows={1}
        placeholder="Ask about crops, batches, prices…"
        disabled={disabled}
        onKeyDown={onKeyDown}
        onInput={onInput}
        className={cn(
          "flex-1 resize-none rounded-xl border bg-gray-50 px-3 py-2 text-sm outline-none",
          "placeholder:text-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400",
          "disabled:opacity-50",
          "max-h-[120px] leading-relaxed",
        )}
      />
      <button
        onClick={submit}
        disabled={disabled}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full transition",
          "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40",
        )}
        aria-label="Send"
      >
        {disabled ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <SendHorizonal className="size-4" />
        )}
      </button>
    </div>
  );
}
