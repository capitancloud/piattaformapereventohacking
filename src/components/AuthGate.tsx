import { useEffect, useState, type ReactNode } from "react";
import { Lock, LogOut, Terminal } from "lucide-react";

const ACCESS_CODE = "blackmirrorlab";
const STORAGE_KEY = "hackinglab-access";
const LEGACY_KEY = "cyberlab-access";

export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy === "ok" && !localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, "ok");
        localStorage.removeItem(LEGACY_KEY);
      }
      setAuthed(localStorage.getItem(STORAGE_KEY) === "ok");
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setAuthed(false);
  };

  const login = (code: string) => {
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      try {
        localStorage.setItem(STORAGE_KEY, "ok");
      } catch {
        // ignore
      }
      setAuthed(true);
      return true;
    }
    return false;
  };

  return { authed, ready, login, logout };
}

export function LogoutButton() {
  const { authed, logout } = useAuth();
  if (!authed) return null;
  return (
    <button
      onClick={() => {
        logout();
        window.location.href = "/";
      }}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-accent/60 hover:text-foreground"
      title="Esci"
    >
      <LogOut className="h-3.5 w-3.5" />
      Esci
    </button>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { authed, ready, login } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  if (authed) {
    return (
      <>
        {children}
        <div className="fixed right-4 top-4 z-[100]">
          <LogoutButton />
        </div>
      </>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.55 0.24 292 / 0.3), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(oklch(0.78_0.14_295)_1px,transparent_1px),linear-gradient(90deg,oklch(0.78_0.14_295)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (login(code)) {
            setError(false);
          } else {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
          }
        }}
        className={`relative w-full max-w-md rounded-2xl border border-border bg-surface/80 p-8 shadow-2xl shadow-primary/20 backdrop-blur-xl transition-transform ${
          shake ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
      >
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
        `}</style>

        <div className="mb-6 flex items-center justify-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/50">
            <Terminal className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-center font-display text-2xl text-foreground">
          Hacking<span className="text-accent">Lab</span>
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Inserisci il codice di accesso.
        </p>

        <div className="mt-6">
          <label htmlFor="access-code" className="sr-only">
            Codice di accesso
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="access-code"
              type="password"
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Codice di accesso"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 pl-10 text-center text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
            />
          </div>
          {error && (
            <p className="mt-2 text-center text-xs text-destructive">
              Codice non valido. Riprova.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition hover:brightness-110"
        >
          Entra
        </button>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Ambiente di simulazione · Uso formativo
        </p>
      </form>
    </div>
  );
}
