import { useEffect, useState, type ReactNode } from "react";
import { Lock, LogOut } from "lucide-react";

const ACCESS_CODE = "blackmirrorlab";
const STORAGE_KEY = "cyberlab-access";

export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
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
      className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur transition-colors hover:border-white/30 hover:text-white"
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
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.15),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:40px_40px]" />
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
        className={`relative w-full max-w-md rounded-2xl border border-white/10 bg-black/60 p-8 backdrop-blur-xl shadow-2xl transition-transform ${
          shake ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
        style={{
          animation: shake ? "shake 0.4s ease-in-out" : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
          }
        `}</style>

        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10">
            <Lock className="h-6 w-6 text-[#d4af37]" />
          </div>
        </div>

        <h1 className="text-center font-serif text-2xl text-white">
          Black Mirror Lab
        </h1>
        <p className="mt-2 text-center text-sm text-white/60">
          Inserisci il codice di accesso fornito in aula.
        </p>

        <div className="mt-6">
          <label htmlFor="access-code" className="sr-only">
            Codice di accesso
          </label>
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
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-center text-white placeholder:text-white/30 outline-none transition-colors focus:border-[#d4af37]/60 focus:bg-white/10"
          />
          {error && (
            <p className="mt-2 text-center text-xs text-red-400">
              Codice non valido. Riprova.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-[#d4af37] px-4 py-3 text-sm font-medium text-black transition-colors hover:bg-[#e5c14a]"
        >
          Entra
        </button>

        <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-white/30">
          Accesso riservato · Sessione formativa
        </p>
      </form>
    </div>
  );
}
