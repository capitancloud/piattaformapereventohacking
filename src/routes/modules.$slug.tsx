import { createFileRoute, Link, notFound, Outlet, useMatches } from "@tanstack/react-router";
import { ArrowLeft, ListChecks, Lock, RotateCcw, Terminal } from "lucide-react";
import { getScenario } from "@/lib/scenarios";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/modules/$slug")({
  head: ({ params }) => {
    const scenario = params?.slug ? getScenario(params.slug) : undefined;
    return {
      meta: scenario
        ? [
            { title: `${scenario.title} · Hacking Lab` },
            { name: "description", content: scenario.intro.slice(0, 155) },
            { property: "og:title", content: `${scenario.title} · Hacking Lab` },
            { property: "og:description", content: scenario.intro.slice(0, 155) },
          ]
        : [{ title: "Scenario · Hacking Lab" }],
    };
  },
  component: ModuleLayout,
});

function ModuleLayout() {
  const { slug } = Route.useParams();
  const scenario = getScenario(slug);
  if (!scenario) throw notFound();
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
            <Lock className="h-3 w-3 text-accent" /> In arrivo
          </span>
          <h1 className="mt-6 font-display text-5xl text-foreground">{scenario.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{scenario.intro}</p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm text-foreground transition hover:border-accent/60"
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        {activeTaskId && (
          <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border pb-5">
            <Link
              to="/modules/$slug"
              params={{ slug: scenario.slug }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ListChecks className="h-4 w-4 text-accent" /> Riepilogo task
            </Link>
            <div className="flex min-w-48 flex-1 items-center gap-3">
              <div className="h-[3px] min-w-24 flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="shrink-0 font-mono text-xs text-accent">
                {done}/{total}
              </span>
            </div>
            {done > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Ricominciare lo scenario? Il progresso verrà azzerato.")) {
                    resetScenario(scenario.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Ricomincia
              </button>
            )}
          </div>
        )}

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="border-b border-border bg-surface/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Terminal className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg tracking-tight text-foreground">
            Hacking<span className="text-accent">Lab</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
