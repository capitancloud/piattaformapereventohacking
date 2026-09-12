import type { TaskContext } from "../../types";
import { ChoiceGrid, type ChoiceItem } from "./ChoiceGrid";
const ITEMS:ChoiceItem[]=[
 {text:"Qual è la fonte preferibile per gli aggiornamenti di Windows?",options:["Windows Update e produttori ufficiali","Un forum casuale","Un allegato email"],answer:0},
 {text:"Quale account è adatto all'uso quotidiano?",options:["Sempre amministratore","Account standard","Account condiviso"],answer:1},
 {text:"Cosa fare davanti a una richiesta UAC inattesa di un autore sconosciuto?",options:["Approvarla subito","Annullare e verificare","Disattivare UAC"],answer:1},
 {text:"Quale configurazione di Defender è prudente?",options:["Protezione in tempo reale attiva","Tutta la cartella Download esclusa","Scansioni sempre disattivate"],answer:0},
 {text:"Quale profilo usare su un Wi-Fi pubblico?",options:["Pubblico","Privato","Nessun firewall"],answer:0},
 {text:"Per consultare manuali condivisi quale permesso basta?",options:["Lettura","Controllo completo","Proprietario"],answer:0},
 {text:"Un programma con impatto di avvio alto è sicuramente malware?",options:["Sì","No, servono altri indizi","Solo se è Microsoft"],answer:1},
 {text:"Cosa indica l'evento Windows 4625?",options:["Accesso non riuscito","Aggiornamento completato","Firewall attivo"],answer:0},
 {text:"Perché controllare gli amministratori locali?",options:["Per vedere chi ha privilegi elevati","Per velocizzare internet","Per eliminare i log"],answer:0},
 {text:"Quale principio collega tutte queste difese?",options:["Concedere solo ciò che serve e controllare regolarmente","Disattivare ogni funzione","Ignorare gli avvisi"],answer:0},
];
export default function Task10Quiz(props:TaskContext){return <ChoiceGrid {...props} items={ITEMS} minimum={7} instruction="Rispondi a tutte le domande. Per completare il percorso servono almeno 7 risposte corrette su 10." success="Scenario completato: sai applicare i primi controlli per proteggere un sistema Windows e valutare segnali semplici senza agire alla cieca."/>}
