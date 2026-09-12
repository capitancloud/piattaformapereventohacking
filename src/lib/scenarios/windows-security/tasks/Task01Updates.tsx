import type { TaskContext } from "../../types";
import { ChoiceGrid, type ChoiceItem } from "./ChoiceGrid";
const ITEMS: ChoiceItem[] = [
  { text: "Windows segnala un aggiornamento di sicurezza e chiede un riavvio. Il PC contiene un documento aperto.", options: ["Ignorarlo per mesi", "Salvare il lavoro e pianificare il riavvio presto", "Scaricare una patch da un forum"], answer: 1, reason: "Salvare il lavoro evita perdite; installare presto la correzione riduce l'esposizione a problemi già noti." },
  { text: "Un sito sconosciuto propone un programma chiamato Driver Booster con aggiornamenti urgenti.", options: ["Installarlo subito", "Usare Windows Update o il produttore ufficiale", "Disattivare Defender"], answer: 1, reason: "Le fonti ufficiali riducono il rischio di installare software alterato o inutile." },
  { text: "Un PC aziendale deve installare un aggiornamento importante durante una riunione.", options: ["Rimandarlo a un momento concordato e vicino", "Disattivare per sempre gli aggiornamenti", "Spegnere il firewall"], answer: 0, reason: "Una breve pianificazione protegge sia la continuità del lavoro sia la sicurezza." },
];
export default function Task01Updates(props: TaskContext) { return <ChoiceGrid {...props} items={ITEMS} instruction="Scegli la risposta più prudente in ogni situazione. Aggiornare bene significa usare fonti affidabili e non rimandare senza una ragione." success="Hai costruito una routine realistica: fonte ufficiale, salvataggio del lavoro, installazione e riavvio in tempi ragionevoli." />; }
