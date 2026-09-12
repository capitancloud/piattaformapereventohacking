import { useState } from "react";
import { BadgeCheck, Orbit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const HOSTS=["www.aurora.example","api.aurora.example","status.aurora.example","cdn.aurora.example"];
export default function Task05Certificates({markComplete,isComplete}:TaskContext){const [stars,setStars]=useState<string[]>([]);const reveal=()=>{const next=HOSTS[stars.length];if(!next)return;const all=[...stars,next];setStars(all);if(all.length===HOSTS.length)markComplete()};return <div>
  <section className="relative min-h-[390px] overflow-hidden rounded-lg border border-border bg-background p-5">
    <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,var(--accent)_1px,transparent_1px)] [background-size:28px_28px]"/>
    <div className="relative z-10 flex items-center justify-between"><div><p className="font-mono text-xs text-accent">CERTIFICATE TRANSPARENCY</p><h3 className="mt-1 font-display text-xl">Costellazione pubblica</h3></div><Orbit className="animate-spin text-accent [animation-duration:8s]"/></div>
    <div className="relative z-10 mt-8 grid min-h-52 place-items-center">
      <div className="relative grid h-28 w-28 place-items-center rounded-full border border-accent bg-primary/15 text-center shadow-xl shadow-primary/20"><BadgeCheck className="mb-1 text-accent"/><span className="text-xs">Certificato TLS</span>
        {stars.map((host,i)=><div key={host} className={cn("absolute w-36 animate-in zoom-in rounded-md border border-border bg-surface p-2 text-center font-mono text-[10px]",i===0&&"-left-28 -top-10",i===1&&"-right-28 -top-10",i===2&&"-bottom-14 -left-28",i===3&&"-bottom-14 -right-28")}>{host}</div>)}
      </div>
    </div>
    <Button className="relative z-10 mt-10 w-full" disabled={stars.length===HOSTS.length} onClick={reveal}><Sparkles/>{stars.length===HOSTS.length?"Costellazione completa":"Rivela il prossimo nome"}</Button>
  </section>{isComplete?<SuccessNote>I nomi presenti nei certificati hanno ampliato l'inventario pubblico. Sono piste da verificare, non prove di vulnerabilità.</SuccessNote>:<InfoNote>I registri pubblici dei certificati possono mostrare nomi utilizzati dall'organizzazione, compresi servizi non evidenti dal sito principale.</InfoNote>}
  </div>}