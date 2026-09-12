import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Lock, RotateCcw, Terminal, Zap, Target, ShieldCheck, Rocket, Sparkles, AlertTriangle } from "lucide-react";
import { scenarios } from "@/lib/scenarios";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

const TOTAL_PLANNED = 20;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hacking Lab — Simulazioni interattive di ethical hacking" },
      {
        name: "description",
        content:
          "Hacking Lab è una piattaforma di simulazione per imparare l'ethical hacking. 20 scenari a micro-task interattivi, dal networking al reverse engineering.",
      },
      { property: "og:title", content: "Hacking Lab — Simulazioni interattive di ethical hacking" },
      {
        property: "og:description",
        content:
          "20 scenari interattivi di ethical hacking, con simulazioni pratiche in un ambiente sicuro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { completedFor, resetScenario } = useProgress();
  const available = scenarios.filter((s) => s.status === "available");
  const comingSoon = TOTAL_PLANNED - available.length;
  const totalMicroTasks = scenarios.reduce((sum, s) => sum + s.tasks.length, 0);

  return (
    <div className="grain min-h-screen bg-background">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/40">
            <Terminal className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl tracking-tight text-foreground">
            Hacking<span className="text-accent">Lab</span>
          </span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#scenari" className="transition hover:text-foreground">Scenari</a>
          <a href="#come-funziona" className="transition hover:text-foreground">Come funziona</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-24 md:pt-20 md:pb-32">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-accent backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono uppercase tracking-[0.2em]">Ethical hacking · Interactive lab</span>
          </div>
          <h1 className="max-w-4xl font-display text-5xl leading-[1.02] text-foreground md:text-7xl">
            Impara l'ethical hacking{" "}
            <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              facendolo davvero.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Hacking Lab è una piattaforma di simulazione completa: ogni scenario ricrea un ambiente
            vulnerabile e ti guida, passo per passo, ad attaccarlo e a capirne le difese. Zero
            setup, nessun rischio, tutto nel browser.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="font-medium">Realizzata in esclusiva da Ethical Hacker Italiani</span>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/modules/$slug"
              params={{ slug: "start-here" }}
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:brightness-110 hover:shadow-primary/60"
            >
              Inizia da qui, aspirante hacker
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#scenari"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:border-accent/60"
            >
              Sfoglia gli scenari
            </a>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-border/60 pt-8">
            <Metric value={`${available.length}`} label="Scenari completi" />
            <Metric value={`${totalMicroTasks}`} label="Micro-task interattivi" />
            <Metric value="Italia" label="Made by Ethical Hacker Italiani" />
          </div>
        </div>

        {/* violet aura */}
        <div
          className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.24 292) 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -left-40 top-60 h-[400px] w-[400px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.78 0.14 295) 0%, transparent 70%)" }}
        />
      </section>

      {/* Scenari */}
      <section id="scenari" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Catalogo scenari
            </p>
            <h2 className="font-display text-3xl text-foreground md:text-4xl">
              Piattaforma completa: 20 scenari, 200 micro-task
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tutti gli scenari sono disponibili e pronti da esplorare. Ogni percorso è pensato e
            realizzato in esclusiva da Ethical Hacker Italiani.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {scenarios.map((s, i) => {
            const done = completedFor(s.id).length;
            const total = s.tasks.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const resetButton = done > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (confirm(`Azzerare il progresso di "${s.title}"?`)) resetScenario(s.id);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" /> Azzera progresso
              </button>
            );

            const featured = s.slug === "start-here";

            if (featured) {
              return (
                <Link
                  key={s.id}
                  to="/modules/$slug"
                  params={{ slug: s.slug }}
                  className="group md:col-span-2"
                >
                  <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-primary/25 via-surface to-accent/15 p-8 transition duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/40">
                    {/* animated shine */}
                    <div className="pointer-events-none absolute inset-0 opacity-60">
                      <div
                        className="absolute -left-40 -top-40 h-96 w-96 rounded-full blur-3xl"
                        style={{ background: "radial-gradient(circle, oklch(0.78 0.14 295 / 0.35) 0%, transparent 70%)" }}
                      />
                      <div
                        className="absolute -right-32 -bottom-32 h-80 w-80 rounded-full blur-3xl"
                        style={{ background: "radial-gradient(circle, oklch(0.55 0.24 292 / 0.4) 0%, transparent 70%)" }}
                      />
                    </div>
                    <div className="pointer-events-none absolute -right-1 -top-1 flex items-center gap-1.5 rounded-bl-2xl rounded-tr-2xl border-b border-l border-accent/50 bg-gradient-to-br from-accent to-primary px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-primary-foreground shadow-lg shadow-accent/40">
                      <Sparkles className="h-3 w-3" /> Parti da qui
                    </div>

                    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-primary shadow-xl shadow-primary/40">
                        <Rocket className="h-8 w-8 text-primary-foreground" strokeWidth={2} />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                          Scenario introduttivo · {s.category}
                        </span>
                        <h3 className="mb-3 font-display text-4xl leading-tight text-foreground md:text-5xl">
                          {s.title}
                        </h3>
                        <p className="mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                          {s.subtitle}
                        </p>

                        <ul className="mb-6 grid gap-2 text-sm text-foreground/90 sm:grid-cols-3">
                          {s.highlights.map((h) => (
                            <li key={h} className="flex items-start gap-2 rounded-lg border border-accent/20 bg-background/40 p-3 backdrop-blur">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                              <span className="text-xs leading-snug">{h}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-auto space-y-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{total} micro-task guidati</span>
                            <span className="font-mono text-accent">{done}/{total}</span>
                          </div>
                          <div className="h-[4px] w-full overflow-hidden rounded-full bg-border/50">
                            <div
                              className="h-full bg-gradient-to-r from-accent via-primary to-accent transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between gap-3 pt-2">
                            <span className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition group-hover:brightness-110 group-hover:shadow-accent/60">
                              {done > 0 ? "Continua da qui" : "Inizia da qui"}
                              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                            {resetButton}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            }

            return (
              <Link
                key={s.id}
                to="/modules/$slug"
                params={{ slug: s.slug }}
                className="group"
              >
                <article
                  className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-surface-2 p-7 transition duration-300 hover:border-accent/60 hover:shadow-2xl hover:shadow-primary/20"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      #{String(i + 1).padStart(2, "0")} · {s.category}
                    </span>
                    <span className="rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-success">
                      Disponibile
                    </span>
                  </div>

                  <h3 className="mb-2 font-display text-3xl text-foreground">{s.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {s.subtitle}
                  </p>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{total} micro-task</span>
                      <span className="font-mono text-accent">
                        {done}/{total}
                      </span>
                    </div>
                    <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-3">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-accent transition group-hover:gap-3">
                        {done > 0 ? "Continua lo scenario" : "Inizia lo scenario"}
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                      {resetButton}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}

          {/* Complete platform card */}
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-primary/20 to-accent/10 p-7">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                Piattaforma completa
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-success">
                <ShieldCheck className="h-2.5 w-2.5" /> Disponibile
              </span>
            </div>

            <h3 className="mb-2 font-display text-3xl text-foreground">200 micro-task ti aspettano</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tutti gli scenari sono già pubblicati: networking, Linux, Python, PowerShell, analisi
              del traffico, sicurezza dei sistemi, scansione, enumerazione, vulnerability assessment,
              exploitation, web exploitation, post-exploitation, privilege escalation e molto altro.
            </p>
          </div>
        </div>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" className="border-t border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-20 md:grid-cols-3">
          {[
            {
              icon: Target,
              t: "Contesto pratico",
              d: "Ogni task parte da uno scenario reale spiegato in poche righe. Nessun sermone teorico.",
            },
            {
              icon: Zap,
              t: "Interazione vera",
              d: "Manipoli tu URL, form, protocolli, pacchetti. La simulazione risponde come nel mondo reale.",
            },
            {
              icon: ShieldCheck,
              t: "Sicuro per default",
              d: "Nessuna richiesta di rete verso host reali. Nessun rischio legale, nessun sistema esterno coinvolto.",
            },
          ].map((x) => (
            <div key={x.t}>
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg border border-accent/30 bg-accent/10">
                <x.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="mb-2 font-display text-xl text-foreground">{x.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-muted-foreground">
        Hacking Lab · Piattaforma di simulazione a scopo formativo, realizzata in esclusiva da
        Ethical Hacker Italiani. Ambiente completamente simulato: nessun sistema reale viene
        contattato.
      </footer>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-foreground md:text-3xl">{value}</div>
      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
