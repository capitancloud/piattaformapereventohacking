import { useState } from "react";
import { AtSign, Mail, Network, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const NODES = [
  { type: "A", value: "203.0.113.24", text: "Collega un nome a un indirizzo IPv4", icon: Server },
  { type: "MX", value: "mail.aurora.example", text: "Indica dove viene ricevuta la posta", icon: Mail },
  { type: "NS", value: "ns1.dns-provider.example", text: "Dichiara i server autorevoli del dominio", icon: Network },
  { type: "TXT", value: "v=spf1 include:mail.example", text: "Pubblica testo, spesso per verifiche e policy email", icon: AtSign },
];
export default function Task03Dns({ markComplete, isComplete }: TaskContext) {
  const [opened, setOpened] = useState<string[]>([]);
  const open = (type: string) => { setOpened((old) => old.includes(type) ? old : [...old, type]); if (!opened.includes(type) && opened.length === NODES.length - 1) markComplete(); };
  return <div>
    <section className="rounded-lg border border-border bg-surface p-5">
      <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full border border-accent bg-primary/15 text-center shadow-lg shadow-primary/20"><div><GlobeIcon/><strong className="block text-xs">aurora.example</strong></div></div>
      <div className="grid gap-3 sm:grid-cols-2">{NODES.map((node) => { const Icon=node.icon; const on=opened.includes(node.type); return <Button key={node.type} variant="outline" onClick={() => open(node.type)} className={cn("h-auto min-h-32 items-start justify-start whitespace-normal p-4 text-left transition", on && "border-accent bg-accent/5") }>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-accent"><Icon/></span><span className="min-w-0"><strong className="font-mono text-accent">{node.type}</strong><span className="mt-1 block break-all text-xs font-normal text-foreground">{on ? node.value : "Apri il record"}</span>{on && <span className="mt-2 block text-xs font-normal leading-relaxed text-muted-foreground">{node.text}</span>}</span>
      </Button>; })}</div>
    </section>
    {isComplete ? <SuccessNote>Hai letto i quattro record fondamentali come una mappa: indirizzi, posta, autorità DNS e informazioni testuali.</SuccessNote> : <InfoNote>Apri ogni ramo. I record DNS descrivono servizi pubblici, ma non dimostrano da soli che un sistema sia vulnerabile.</InfoNote>}
  </div>;
}
function GlobeIcon(){return <div className="mb-1 text-2xl text-accent">◎</div>}