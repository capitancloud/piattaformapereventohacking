import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { getScenario } from "@/lib/scenarios";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/modules/$slug/")({
  head: ({ params }) => {
    const scenario = params?.slug ? getScenario(params.slug) : undefined;
    const title = scenario ? `${scenario.title}: riepilogo task · Hacking Lab` : "Riepilogo scenario · Hacking Lab";
    const description = scenario
      ? `Consulta i micro-task interattivi dello scenario ${scenario.title}.`
      : "Consulta i micro-task dello scenario di ethical hacking.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ModuleIntro,
});

function ModuleIntro() {
  const { slug } = Route.useParams();
  const scenario = getScenario(slug);
  if (!scenario) throw notFound();
  const { completedFor } = useProgress();
  const completed = completedFor(scenario.id);
  const first = scenario.tasks[0];
  if (!first) throw notFound();
  const nextUncompleted = scenario.tasks.find((t) => !completed.includes(t.id)) ?? first;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        Scenario · {scenario.category}
      </p>
      <h2 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
        {scenario.title}
      </h2>
      <p className="mt-2 text-lg text-accent/90">{scenario.subtitle}</p>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{scenario.intro}</p>

      <div className="mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
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

      <section className="mt-12 border-t border-border pt-8" aria-labelledby="task-summary-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Percorso</p>
            <h2 id="task-summary-title" className="mt-1 font-display text-2xl text-foreground">
              Riepilogo task
            </h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {completed.length}/{scenario.tasks.length} completati
          </span>
        </div>

        <nav className="grid gap-2 md:grid-cols-2" aria-label="Task dello scenario">
          {scenario.tasks.map((task, index) => {
            const isDone = completed.includes(task.id);
            return (
              <Link
                key={task.id}
                to="/modules/$slug/$taskId"
                params={{ slug: scenario.slug, taskId: task.id }}
                className="flex min-h-14 items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground transition hover:border-accent/60 hover:text-foreground"
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                )}
                <span className="font-mono text-[11px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-foreground">{task.title}</span>
              </Link>
            );
          })}
        </nav>
      </section>
    </div>
  );
}
