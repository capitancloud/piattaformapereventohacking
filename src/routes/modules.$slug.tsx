import { createFileRoute, Link, notFound, Outlet, useMatches } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, Lock, RotateCcw } from "lucide-react";
import { getScenario } from "@/lib/scenarios";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/modules/$slug")({
  loader: ({ params }) => {
    const scenario = getScenario(params.slug);
    if (!scenario) throw notFound();
    return { scenario };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.scenario.title} · CyberLab` },
          { name: "description", content: loaderData.scenario.intro.slice(0, 155) },
          { property: "og:title", content: `${loaderData.scenario.title} · CyberLab` },
          { property: "og:description", content: loaderData.scenario.intro.slice(0, 155) },
        ]
      : [{ title: "Modulo · CyberLab" }],
  }),
  component: ModuleLayout,
});

function ModuleLayout() {
  const { scenario } = Route.useLoaderData();
  const { completedFor, resetScenario } = useProgress();
  const completed = completedFor(scenario.id);
  const matches = useMatches();
  const activeTaskId = (matches[matches.length - 1]?.params as { taskId?: string } | undefined)?.taskId;

  if (scenario.status === "coming-soon") {
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3 text-gold" /> Prossimamente
          </span>
          <h1 className="mt-6 font-serif text-5xl text-ivory">{scenario.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{scenario.intro}</p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm text-ivory transition hover:border-gold/60"
          >
            <ArrowLeft className="h-4 w-4" /> Torna alla home
          </Link>
        </div>
      </div>
    );
  }

  const total = scenario.tasks.length;
  const done = completed.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[320px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-ivory"
          >
            <ArrowLeft className="h-3 w-3" /> Tutti i moduli
          </Link>
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold">
            Modulo · {scenario.difficulty}
          </p>
          <h1 className="font-serif text-3xl leading-tight text-ivory">{scenario.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{scenario.subtitle}</p>

          <div className="mt-6 rounded-lg border border-border bg-surface p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-mono text-gold">
                {done}/{total}
              </span>
            </div>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-gold transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            {done > 0 && (
              <button
                onClick={() => {
                  if (confirm("Ricominciare il modulo? Il progresso verrà azzerato.")) {
                    resetScenario(scenario.id);
                  }
                }}
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition hover:text-ivory"
              >
                <RotateCcw className="h-3 w-3" /> Ricomincia
              </button>
            )}
          </div>

          <nav className="mt-6 space-y-1">
            {scenario.tasks.map((t, i) => {
              const isDone = completed.includes(t.id);
              const active = activeTaskId === t.id;
              return (
                <Link
                  key={t.id}
                  to="/modules/$slug/$taskId"
                  params={{ slug: scenario.slug, taskId: t.id }}
                  className={cn(
                    "flex items-start gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm transition",
                    active
                      ? "border-gold/40 bg-gold/10 text-ivory"
                      : "text-muted-foreground hover:bg-surface hover:text-ivory",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                  )}
                  <span className="flex-1">
                    <span className="mr-2 font-mono text-[11px] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-lg tracking-tight text-ivory">CyberLab</span>
        </Link>
      </div>
    </header>
  );
}
