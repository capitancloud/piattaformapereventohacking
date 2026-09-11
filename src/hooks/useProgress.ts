import { useCallback, useEffect, useState } from "react";

const KEY = "cyberlab.progress.v1";

type ProgressState = Record<string, string[]>; // scenarioId -> completed task ids

function read(): ProgressState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressState;
  } catch {
    return {};
  }
}

function write(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("cyberlab:progress"));
}

export function useProgress(scenarioId?: string) {
  const [state, setState] = useState<ProgressState>({});

  useEffect(() => {
    setState(read());
    const onChange = () => setState(read());
    window.addEventListener("cyberlab:progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cyberlab:progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const completeTask = useCallback((sid: string, taskId: string) => {
    const current = read();
    const list = current[sid] ?? [];
    if (!list.includes(taskId)) {
      current[sid] = [...list, taskId];
      write(current);
    }
  }, []);

  const resetScenario = useCallback((sid: string) => {
    const current = read();
    delete current[sid];
    write(current);
  }, []);

  const completedFor = (sid: string) => state[sid] ?? [];

  return {
    state,
    completedFor,
    completed: scenarioId ? state[scenarioId] ?? [] : [],
    completeTask,
    resetScenario,
  };
}
