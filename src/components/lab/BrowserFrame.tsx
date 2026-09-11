import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BrowserFrame({
  url,
  onUrlChange,
  onGo,
  editable = true,
  children,
  label = "Vai",
  className,
}: {
  url: string;
  onUrlChange?: (v: string) => void;
  onGo?: () => void;
  editable?: boolean;
  children: ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/50",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-surface-2 px-3 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        </div>
        <form
          className="flex flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onGo?.();
          }}
        >
          <input
            value={url}
            readOnly={!editable}
            onChange={(e) => onUrlChange?.(e.target.value)}
            spellCheck={false}
            className={cn(
              "w-full rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-ivory outline-none transition",
              editable
                ? "focus:border-gold focus:ring-2 focus:ring-gold/25"
                : "cursor-default text-muted-foreground",
            )}
          />
          {onGo && (
            <button
              type="submit"
              className="shrink-0 rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
            >
              {label}
            </button>
          )}
        </form>
      </div>
      <div className="min-h-[220px] bg-background p-5">{children}</div>
    </div>
  );
}
