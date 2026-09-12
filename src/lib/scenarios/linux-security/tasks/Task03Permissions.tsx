import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";
const FILES = [
 { name: "backup.sh", description: "Script eseguito solo dal proprietario", options: ["777", "755", "700"], answer: "700" },
 { name: "segreti.env", description: "Credenziali leggibili e modificabili solo dal proprietario", options: ["600", "644", "666"], answer: "600" },
 { name: "manuale.txt", description: "Documento pubblico, modificabile solo dal proprietario", options: ["640", "644", "777"], answer: "644" },
];
export default function Task03Permissions({ markComplete, isComplete }: TaskContext) {
 const [answers, setAnswers] = useState<Record<string, string>>({}); const [checked, setChecked] = useState(false);
 const correct = FILES.every((file) => answers[file.name] === file.answer);
 return <div><div className="grid gap-4 md:grid-cols-3">{FILES.map((file) => <div key={file.name} className="rounded-lg border border-border bg-surface p-4"><div className="font-mono text-sm text-accent">{file.name}</div><p className="my-3 min-h-10 text-xs leading-relaxed text-muted-foreground">{file.description}</p><div className="grid grid-cols-3 gap-2">{file.options.map((option) => <Button key={option} type="button" variant="outline" size="sm" onClick={() => { setChecked(false); setAnswers((previous) => ({ ...previous, [file.name]: option })); }} className={cn(answers[file.name] === option && "border-accent bg-accent/15", checked && option === file.answer && "border-success bg-success/10 text-success", checked && answers[file.name] === option && option !== file.answer && "border-destructive text-destructive")}>{option}</Button>)}</div>{checked && <p className="mt-3 text-xs text-muted-foreground">Scelta consigliata: <span className="font-mono text-foreground">{file.answer}</span></p>}</div>)}</div><div className="mt-4"><Button type="button" onClick={() => { setChecked(true); if (correct) markComplete(); }} disabled={Object.keys(answers).length < FILES.length}>Controlla permessi</Button></div>{isComplete ? <SuccessNote>I permessi non devono essere più larghi del necessario: i file sensibili restano privati e gli script non diventano modificabili da chiunque.</SuccessNote> : <InfoNote>Il primo numero riguarda il proprietario, il secondo il gruppo, il terzo tutti gli altri. 7 significa rwx, 6 rw-, 5 r-x, 4 r--, 0 nessun permesso.</InfoNote>}</div>;
}
