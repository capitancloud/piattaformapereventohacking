import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TermLine {
  kind: "prompt" | "out" | "err" | "info";
  text: string;
}

/**
 * Finto terminale con animazione di typing riga per riga.
 * Nessun comando viene realmente eseguito: tutto è simulato in-browser.
 */
export function Terminal({
  title = "cmd.exe",
  prompt = "C:\\Windows\\system32> ",
  lines,
  className,
  onDone,
  speed = 8,
}: {
  title?: string;
  prompt?: string;
  lines: TermLine[];
  className?: string;
  onDone?: () => void;
  speed?: number;
}) {
  const [rendered, setRendered] = useState<TermLine[]>([]);
  const [current, setCurrent] = useState("");
  const [idx, setIdx] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const key = lines.map((l) => l.text).join("|");

  useEffect(() => {
    setRendered([]);
    setCurrent("");
    setIdx(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (idx >= lines.length) {
      onDone?.();
      return;
    }
    const line = lines[idx]!;
    if (line.kind === "prompt") {
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setCurrent(line.text.slice(0, i));
        if (i >= line.text.length) {
          clearInterval(id);
          setTimeout(() => {
            setRendered((r) => [...r, line]);
            setCurrent("");
            setIdx((n) => n + 1);
          }, 120);
        }
      }, speed);
      return () => clearInterval(id);
    }
    const delay = line.kind === "out" ? 40 : 60;
    const id = setTimeout(() => {
      setRendered((r) => [...r, line]);
      setIdx((n) => n + 1);
    }, delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, key]);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [rendered, current]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-black shadow-2xl shadow-black/60",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2 px-3 py-2 text-xs">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        </div>
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">{title}</span>
      </div>
      <div
        ref={scroller}
        className="max-h-80 min-h-[180px] overflow-auto p-4 font-mono text-[12px] leading-relaxed"
      >
        {rendered.map((l, i) => (
          <TermRow key={i} line={l} prompt={prompt} />
        ))}
        {idx < lines.length && lines[idx]!.kind === "prompt" && (
          <div className="text-ivory">
            <span className="text-gold-soft">{prompt}</span>
            {current}
            <Caret />
          </div>
        )}
        {idx >= lines.length && (
          <div className="text-ivory">
            <span className="text-gold-soft">{prompt}</span>
            <Caret />
          </div>
        )}
      </div>
    </div>
  );
}

function TermRow({ line, prompt }: { line: TermLine; prompt: string }) {
  if (line.kind === "prompt")
    return (
      <div className="text-ivory">
        <span className="text-gold-soft">{prompt}</span>
        {line.text}
      </div>
    );
  if (line.kind === "err")
    return <div className="whitespace-pre-wrap text-destructive/90">{line.text}</div>;
  if (line.kind === "info")
    return <div className="whitespace-pre-wrap text-gold-soft/90">{line.text}</div>;
  return <div className="whitespace-pre-wrap text-ivory/90">{line.text}</div>;
}

function Caret() {
  return (
    <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-pulse bg-gold" />
  );
}

export function CodeBlock({
  language,
  children,
  className,
}: {
  language?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-black/80",
        className,
      )}
    >
      {language && (
        <div className="border-b border-border/60 bg-surface-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {language}
        </div>
      )}
      <pre className="max-h-80 overflow-auto p-4 font-mono text-[12px] leading-relaxed text-ivory/90">
        {children}
      </pre>
    </div>
  );
}
