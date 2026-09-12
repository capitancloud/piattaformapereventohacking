import type { ComponentType } from "react";

export type TaskStatus = "idle" | "success";

export interface TaskContext {
  markComplete: () => void;
  isComplete: boolean;
}

export interface Task {
  id: string;
  title: string;
  goal: string;
  brief: string;
  details?: string;
  hint: string;
  explanation: string;
  Simulation: ComponentType<TaskContext>;
}

export interface Scenario {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  highlights: [string, string, string];
  category: string;
  difficulty: "Base" | "Intermedio" | "Avanzato";
  status: "available" | "coming-soon";
  tasks: Task[];
}
