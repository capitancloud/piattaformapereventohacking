import type { TaskContext } from "../../types";
import { ChoiceGrid, type ChoiceItem } from "./ChoiceGrid";
const ITEMS: ChoiceItem[] = [
  { text: "Il gestore pacchetti segnala aggiornamenti di sicurezza disponibili.", options: ["Installarli dopo una verifica", "Ignorarli per sempre"], answer: 0, reason: "Le patch correggono vulnerabilità note; è prudente verificarle e applicarle regolarmente." },
  { text: "Un server importante non è mai stato riavviato dopo l'aggiornamento del kernel.", options: ["Pianificare un riavvio", "Cancellare i log"], answer: 0, reason: "Il nuovo kernel entra davvero in uso soltanto dopo il riavvio." },
  { text: "Un repository sconosciuto promette versioni modificate di molti pacchetti.", options: ["Aggiungerlo subito", "Controllarne origine e affidabilità"], answer: 1, reason: "I pacchetti eseguono codice sul sistema: la fonte deve essere affidabile." },
  { text: "Gli aggiornamenti automatici di sicurezza sono disattivati su una macchina sempre connessa.", options: ["Valutare di abilitarli", "Lasciare tutto invariato"], answer: 0, reason: "Automatizzare le correzioni critiche riduce il tempo in cui una falla resta sfruttabile." },
];
export default function Task01Updates(props: TaskContext) { return <ChoiceGrid {...props} items={ITEMS} instruction="Scegli l'azione che riduce il rischio senza trattare gli aggiornamenti come un gesto automatico e cieco." success="Hai costruito una routine corretta: fonti affidabili, patch regolari e riavvii pianificati quando servono." />; }
