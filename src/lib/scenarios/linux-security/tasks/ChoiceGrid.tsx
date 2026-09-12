import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

export type ChoiceItem = { text: string; options: string[]; answer: number; reason?: string };

export function ChoiceGrid({ items, markComplete, isComplete, instruction, success, minimum }: TaskContext & { items: ChoiceItem[]; instruction: string; success: string; minimum?: number }) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(items.length).fill(null));
  const [checked, setChecked] = useState(false);
  const needed = minimum ?? items.length;
  const score = answers.reduce((sum: number, answer, index) => sum + (answer === items[index]?.answer ? 1 : 0), 0);
  const verify = () => { setChecked(true); if (score >= needed) markComplete(); };
  const reset = () => { setAnswers(Array(items.length).fill(null)); setChecked(false); };

  return <div>
    <div className="space-y-3">
      {items.map((item, index) => <div key={item.text} className="rounded-lg border border-border bg-surface p-4">
        <p className="mb-3 text-sm leading-relaxed text-foreground"><span className="mr-2 font-mono text-accent">{index + 1}.</span>{item.text}</p>
        <div className="flex flex-wrap gap-2">
          {item.options.map((option, optionIndex) => {
            const selected = answers[index] === optionIndex;
            const correct = checked && optionIndex === item.answer;
            const wrong = checked && selected && !correct;
            return <Button key={option} type="button" variant="outline" size="sm" disabled={checked} onClick={() => setAnswers((previous) => previous.map((value, i) => i === index ? optionIndex : value))} className={cn("h-auto min-h-8 whitespace-normal text-left", selected && !checked && "border-accent bg-accent/15", correct && "border-success bg-success/10 text-success", wrong && "border-destructive bg-destructive/10 text-destructive")}>
              {correct && <CheckCircle2 />}{wrong && <XCircle />}{option}
            </Button>
          })}
        </div>
        {checked && item.reason && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.reason}</p>}
      </div>)}
    </div>
    <div className="mt-4 flex items-center gap-3">
      {!checked ? <Button type="button" disabled={answers.some((answer) => answer === null)} onClick={verify}>Verifica risposte</Button> : <Button type="button" variant="outline" onClick={reset}><RotateCcw />Riprova</Button>}
      {checked && <span className="font-mono text-xs text-muted-foreground">{score}/{items.length}</span>}
    </div>
    {isComplete ? <SuccessNote>{success}</SuccessNote> : <InfoNote>{instruction}</InfoNote>}
  </div>;
}
