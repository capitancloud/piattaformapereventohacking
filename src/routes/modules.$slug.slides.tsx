import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  X,
  ShieldAlert,
  Eye,
  MousePointerClick,
  Layers,
  Crown,
  Boxes,
  Fingerprint,
  Network,
  Unlock,
  ShieldCheck,
  Play,
  Sparkles,
} from "lucide-react";
import { getScenario } from "@/lib/scenarios";
import type { Slide } from "@/lib/scenarios/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldAlert,
  Eye,
  MousePointerClick,
  Layers,
  Crown,
  Boxes,
  Fingerprint,
  Network,
  Unlock,
  ShieldCheck,
  Sparkles,
};

export const Route = createFileRoute("/modules/$slug/slides")({
  head: ({ params }) => {
    const scenario = params?.slug ? getScenario(params.slug) : undefined;
    return {
      meta: [
        { title: scenario ? `Slide · ${scenario.title}` : "Slide · CyberLab" },
        {
          name: "description",
          content: scenario
            ? `Panoramica in 10 slide dello scenario ${scenario.title}.`
            : "Panoramica dello scenario.",
        },
      ],
    };
  },
  component: SlidesView,
});

function SlidesView() {
  const { slug } = Route.useParams();
  const scenario = getScenario(slug);
  if (!scenario) throw notFound();
  const slides = scenario.slides ?? [];
  const navigate = useNavigate();
  const [i, setI] = useState(0);

  const exit = useCallback(() => {
    navigate({ to: "/modules/$slug", params: { slug: scenario.slug } });
  }, [navigate, scenario.slug]);

  const next = useCallback(
    () => setI((v) => Math.min(v + 1, slides.length - 1)),
    [slides.length],
  );
  const prev = useCallback(() => setI((v) => Math.max(v - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") exit();
      else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(slides.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, exit, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center text-ivory">
        <div>
          <p className="text-muted-foreground">Le slide di questo scenario non sono ancora disponibili.</p>
          <Link
            to="/modules/$slug"
            params={{ slug: scenario.slug }}
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm hover:border-gold/60"
          >
            <ArrowLeft className="h-4 w-4" /> Torna al modulo
          </Link>
        </div>
      </div>
    );
  }

  const slide = slides[i]!;
  const isLast = i === slides.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background text-ivory">
      {/* aura */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, oklch(0.82 0.13 82 / 0.18), transparent 60%), radial-gradient(900px 500px at 100% 100%, oklch(0.82 0.13 82 / 0.10), transparent 60%)",
        }}
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-40" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-border/60 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-gold/40 bg-gold/10">
            <ShieldCheck className="h-4 w-4 text-gold" />
          </span>
          <div className="leading-tight">
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Panoramica</div>
            <div className="font-serif text-lg">{scenario.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={exit}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition hover:border-gold/60 hover:text-ivory"
            aria-label="Chiudi slide"
          >
            <X className="h-3.5 w-3.5" /> Esc
          </button>
        </div>
      </div>

      {/* Slide stage */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-8">
        <SlideCard key={i} slide={slide} index={i} total={slides.length} />
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-border/60 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <button
            type="button"
            onClick={prev}
            disabled={i === 0}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm text-ivory transition hover:border-gold/60 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Indietro
          </button>

          {/* progress dots */}
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {slides.map((_, k) => (
              <button
                key={k}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Vai alla slide ${k + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  k === i
                    ? "w-8 bg-gold"
                    : k < i
                      ? "w-2 bg-gold/50"
                      : "w-2 bg-border hover:bg-muted-foreground/40",
                )}
              />
            ))}
          </div>

          {isLast ? (
            <Link
              to="/modules/$slug"
              params={{ slug: scenario.slug }}
              className="group inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              <Play className="h-4 w-4" /> Inizia lo scenario
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={next}
              className="group inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              Avanti
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SlideCard({ slide, index, total }: { slide: Slide; index: number; total: number }) {
  const Icon = slide.icon ? ICONS[slide.icon] ?? Sparkles : Sparkles;
  const accent = slide.accent ?? "gold";
  const accentColor =
    accent === "danger"
      ? "text-danger"
      : accent === "success"
        ? "text-success"
        : accent === "neutral"
          ? "text-ivory"
          : "text-gold";
  const accentBorder =
    accent === "danger"
      ? "border-danger/40 bg-danger/10"
      : accent === "success"
        ? "border-success/40 bg-success/10"
        : accent === "neutral"
          ? "border-border bg-surface"
          : "border-gold/40 bg-gold/10";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 relative w-full max-w-5xl duration-500">
      {/* frame */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-surface/60 p-10 shadow-2xl shadow-black/40 backdrop-blur md:p-16">
        {/* corner ornaments */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />

        {/* index chip */}
        <div className="mb-8 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Slide {String(index + 1).padStart(2, "0")} · di {total}
          </span>
          <span
            className={cn(
              "grid h-12 w-12 place-items-center rounded-xl border",
              accentBorder,
            )}
          >
            <Icon className={cn("h-6 w-6", accentColor)} />
          </span>
        </div>

        {slide.kicker && (
          <p className={cn("mb-4 text-xs uppercase tracking-[0.28em]", accentColor)}>
            {slide.kicker}
          </p>
        )}

        <h2 className="font-serif text-4xl leading-[1.05] text-ivory md:text-6xl">
          {slide.title}
        </h2>

        {slide.body && (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {slide.body}
          </p>
        )}

        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="mt-8 space-y-3">
            {slide.bullets.map((b, k) => (
              <li
                key={k}
                className="animate-in fade-in slide-in-from-left-2 flex items-start gap-3 text-base text-ivory md:text-lg"
                style={{ animationDelay: `${120 + k * 90}ms`, animationFillMode: "backwards" }}
              >
                <span
                  className={cn(
                    "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                    accent === "danger"
                      ? "bg-danger"
                      : accent === "success"
                        ? "bg-success"
                        : "bg-gold",
                  )}
                />
                <span className="min-w-0 break-words">{b}</span>
              </li>
            ))}
          </ul>
        )}

        {slide.note && (
          <div
            className={cn(
              "mt-8 flex items-start gap-3 rounded-xl border p-4 md:p-5",
              accentBorder,
            )}
          >
            <Sparkles className={cn("mt-0.5 h-5 w-5 shrink-0", accentColor)} />
            <p className="text-base leading-relaxed text-ivory/90 md:text-lg">{slide.note}</p>
          </div>
        )}

        {slide.code && (
          <pre className="mt-8 max-h-64 min-w-0 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-border bg-background/70 p-4 font-mono text-sm text-ivory">
            {slide.code}
          </pre>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Usa <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">←</kbd>{" "}
        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">→</kbd> per
        navigare · <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">Esc</kbd>{" "}
        per uscire
      </p>
    </div>
  );
}
