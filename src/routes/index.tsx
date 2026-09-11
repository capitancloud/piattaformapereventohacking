import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { scenarios } from "@/lib/scenarios";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberLab — Impara la cybersecurity attaccando (in sicurezza)" },
      {
        name: "description",
        content:
          "Un percorso interattivo per principianti: scenari di attacco simulati, micro-task guidati, apprendimento graduale.",
      },
      { property: "og:title", content: "CyberLab — Impara la cybersecurity attaccando" },
      {
        property: "og:description",
        content: "Scenari di attacco simulati e interattivi per principianti.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { completedFor } = useProgress();

  return (
    <div className="grain min-h-screen bg-background">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-gold/40 bg-gold/10">
            <ShieldCheck className="h-4 w-4 text-gold" />
          </span>
          <span className="font-serif text-xl tracking-tight text-ivory">CyberLab</span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          <a href="#moduli" className="transition hover:text-ivory">Moduli</a>
          <a href="#come-funziona" className="transition hover:text-ivory">Come funziona</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-12 pb-24 md:pt-24 md:pb-32">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-gold" />
            <span>Percorso interattivo · dal principiante alla pratica</span>
          </div>
          <h1 className="max-w-4xl font-serif text-5xl leading-[1.05] text-ivory md:text-7xl">
            Impara la cybersecurity{" "}
            <span className="italic text-gold">attaccando</span>, in un ambiente sicuro.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Quattro scenari, decine di micro-esperimenti guidati. Nessun setup, nessun rischio:
            manipoli davvero URL, form e API in simulazioni fedeli — e vedi cosa succede.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/modules/$slug"
              params={{ slug: "idor" }}
              className="group inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              Inizia con IDOR
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <a
              href="#moduli"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-6 py-3 text-sm font-medium text-ivory transition hover:border-gold/60"
            >
              Sfoglia i moduli
            </a>
          </div>
        </div>

        {/* faint gold aura */}
        <div
          className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.82 0.13 82) 0%, transparent 70%)" }}
        />
      </section>

      {/* Moduli */}
      <section id="moduli" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-gold">I moduli</p>
            <h2 className="font-serif text-3xl text-ivory md:text-4xl">
              Quattro scenari, un percorso graduale
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {scenarios.map((s, i) => {
            const done = completedFor(s.id).length;
            const total = s.tasks.length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            const available = s.status === "available";
            const inner = (
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface p-7 transition duration-300",
                  available
                    ? "border-border hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/10"
                    : "cursor-not-allowed border-border/50 opacity-60",
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Scenario 0{i + 1}
                  </span>
                  {available ? (
                    <span className="rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-success">
                      Disponibile
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Lock className="h-2.5 w-2.5" /> Prossimamente
                    </span>
                  )}
                </div>

                <h3 className="mb-2 font-serif text-3xl text-ivory">{s.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {s.subtitle}
                </p>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {available ? `${total} micro-task` : "In arrivo"}
                    </span>
                    {available && (
                      <span className="font-mono text-gold">
                        {done}/{total}
                      </span>
                    )}
                  </div>
                  {available && (
                    <div className="h-[2px] w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full bg-gold transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                  {available && (
                    <div className="flex items-center gap-1.5 pt-3 text-sm text-gold transition group-hover:gap-3">
                      Inizia il modulo <ArrowUpRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </article>
            );

            return available ? (
              <Link key={s.id} to="/modules/$slug" params={{ slug: s.slug }}>
                {inner}
              </Link>
            ) : (
              <div key={s.id}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" className="border-t border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Contesto breve",
              d: "Ogni task inizia con una spiegazione essenziale del concetto. Zero gergo inutile.",
            },
            {
              n: "02",
              t: "Simulazione reale",
              d: "Un'interfaccia interattiva riproduce l'ambiente vulnerabile. Manipoli davvero URL, form, API.",
            },
            {
              n: "03",
              t: "Feedback immediato",
              d: "Vedi subito il risultato. Poi una spiegazione del perché ha funzionato e come si difende.",
            },
          ].map((x) => (
            <div key={x.n}>
              <div className="mb-4 font-mono text-xs text-gold">{x.n}</div>
              <h3 className="mb-2 font-serif text-xl text-ivory">{x.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-xs text-muted-foreground">
        CyberLab · Ambiente di apprendimento simulato. Nessuna richiesta di rete reale.
      </footer>
    </div>
  );
}
