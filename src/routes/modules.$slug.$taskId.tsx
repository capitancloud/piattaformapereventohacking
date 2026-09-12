import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Target } from "lucide-react";
import { useState } from "react";
import { getScenario } from "@/lib/scenarios";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/modules/$slug/$taskId")({
  head: ({ params }) => {
    const scenario = params?.slug ? getScenario(params.slug) : undefined;
    const task = scenario?.tasks.find((item) => item.id === params?.taskId);
    const title = task ? `${task.title} · ${scenario?.title} · Hacking Lab` : "Task · Hacking Lab";
    const description = task?.brief ?? "Completa un task interattivo di ethical hacking.";
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: TaskPage,
});

function TaskPage() {
  const { slug, taskId } = Route.useParams();
  const scenario = getScenario(slug);
  if (!scenario) throw notFound();
  const taskIndex = scenario.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) throw notFound();
  const task = scenario.tasks[taskIndex];
  if (!task) throw notFound();
  const prev = scenario.tasks[taskIndex - 1];
  const next = scenario.tasks[taskIndex + 1];

  const { completed, completeTask } = useProgress(scenario.id);
  const isComplete = completed.includes(task.id);
  const [hintOpen, setHintOpen] = useState(false);

  const markComplete = () => completeTask(scenario.id, task.id);

  const Simulation = task.Simulation;

  return (
    <div key={task.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-6 flex items-center gap-2 text-xs">
        <span className="font-mono text-accent">
          Task {String(taskIndex + 1).padStart(2, "0")}/{String(scenario.tasks.length).padStart(2, "0")}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{task.goal}</span>
      </div>

      <h2 className="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {task.title}
      </h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        {/* Instructions */}
        <div className="min-w-0">
          <p className="text-base leading-relaxed text-foreground/90">{task.brief}</p>

          {task.details && (
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {task.details.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-accent">
                Obiettivo
              </div>
              <div className="mt-1 text-sm text-foreground">{task.goal}</div>
            </div>
          </div>

          <button
            onClick={() => setHintOpen((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            {hintOpen ? "Nascondi suggerimento" : "Mostra suggerimento"}
          </button>
          {hintOpen && (
            <p className="animate-in fade-in mt-2 break-words rounded-md border border-border bg-surface p-3 text-sm text-muted-foreground">
              {task.hint}
            </p>
          )}

          {isComplete && (
            <div className="animate-in fade-in mt-6 rounded-lg border border-success/40 bg-success/5 p-4">
              <div className="mb-1 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-success">
                <CheckCircle2 className="h-4 w-4" /> Task completato
              </div>
              <p className="text-sm text-foreground/90">{task.explanation}</p>
            </div>
          )}
        </div>

        {/* Simulation */}
        <div className="min-w-0">
          <Simulation markComplete={markComplete} isComplete={isComplete} />
        </div>
      </div>

      {/* Nav */}
      <div className="mt-14 flex items-center justify-between border-t border-border pt-6">
        {prev ? (
          <Link
            to="/modules/$slug/$taskId"
            params={{ slug: scenario.slug, taskId: prev.id }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>
              <span className="block text-[10px] uppercase tracking-widest">Precedente</span>
              {prev.title}
            </span>
          </Link>
        ) : (
          <Link
            to="/modules/$slug"
            params={{ slug: scenario.slug }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Introduzione
          </Link>
        )}

        {next ? (
          <Link
            to="/modules/$slug/$taskId"
            params={{ slug: scenario.slug, taskId: next.id }}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition",
              isComplete
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:brightness-110"
                : "border border-border bg-surface text-foreground hover:border-accent/60",
            )}
          >
            <span className="text-right">
              <span className="block text-[10px] uppercase tracking-widest opacity-70">
                Prossimo
              </span>
              {next.title}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            to="/modules/$slug"
            params={{ slug: scenario.slug }}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110"
          >
            Fine scenario <CheckCircle2 className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
