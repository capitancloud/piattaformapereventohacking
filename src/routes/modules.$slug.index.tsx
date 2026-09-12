import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import { getScenario } from "@/lib/scenarios";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/modules/$slug/")({
  component: ModuleIntro,
});

function ModuleIntro() {
  const { slug } = Route.useParams();
  const scenario = getScenario(slug);
  if (!scenario) throw notFound();
  const { completedFor } = useProgress();
  const completed = completedFor(scenario.id);
  const first = scenario.tasks[0]!;
  const nextUncompleted = scenario.tasks.find((t) => !completed.includes(t.id)) ?? first;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 max-w-3xl duration-500">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Scenario · {scenario.category}
      </p>
      <h2 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
        {scenario.title}
      </h2>
      <p className="mt-2 text-lg text-accent/90">{scenario.subtitle}</p>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{scenario.intro}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { t: "Cosa vedrai", d: "I mattoncini di ogni rete, spiegati con simulazioni." },
          { t: "Cosa farai", d: "Classifichi IP, mandi ARP, esplori NAT, DNS, port scan." },
          { t: "Cosa impari", d: "Le basi tecniche indispensabili per ogni attacco successivo." },
        ].map((x) => (
          <div key={x.t} className="rounded-lg border border-border bg-surface p-5">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {x.t}
            </div>
            <div className="text-sm text-foreground">{x.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          to="/modules/$slug/$taskId"
          params={{ slug: scenario.slug, taskId: nextUncompleted.id }}
          className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:brightness-110"
        >
          <PlayCircle className="h-4 w-4" />
          {completed.length === 0 ? "Inizia il primo task" : "Continua"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <span className="text-sm text-muted-foreground">
          {scenario.tasks.length} micro-task · circa 25 minuti
        </span>
      </div>
    </div>
  );
}
