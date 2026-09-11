import { CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { type ReactNode } from "react";

export function SuccessNote({ children }: { children: ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 mt-4 flex gap-3 rounded-lg border border-success/40 bg-success/10 p-4 duration-500">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
      <p className="text-sm leading-relaxed text-ivory/90">{children}</p>
    </div>
  );
}

export function WarnNote({ children }: { children: ReactNode }) {
  return (
    <div className="animate-in fade-in mt-4 flex gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 duration-300">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <p className="text-sm leading-relaxed text-ivory/90">{children}</p>
    </div>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex gap-3 rounded-lg border border-border bg-surface p-4">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-soft" />
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

export function Record({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span
        className={
          highlight ? "font-mono text-sm text-gold" : "font-mono text-sm text-ivory/90"
        }
      >
        {value}
      </span>
    </div>
  );
}
