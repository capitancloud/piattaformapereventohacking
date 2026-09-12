import type { TaskContext } from "../../types";
import { ChoiceGrid, type ChoiceItem } from "./ChoiceGrid";
const ITEMS: ChoiceItem[] = [
 {text:"Leggere la posta e navigare sul web ogni giorno",options:["Account standard","Account amministratore"],answer:0,reason:"Le attività quotidiane non richiedono il controllo completo del sistema."},
 {text:"Installare un'applicazione approvata dall'organizzazione",options:["Account standard senza conferma","Elevazione amministrativa solo per l'installazione"],answer:1,reason:"L'elevazione temporanea limita la finestra in cui si opera con privilegi maggiori."},
 {text:"Un programma sconosciuto chiede la password dell'amministratore",options:["Inserirla per proseguire","Annullare e verificare origine e motivo"],answer:1,reason:"Una richiesta inattesa non va approvata automaticamente."},
 {text:"Un collega deve usare il PC per pochi minuti",options:["Condividere la propria password","Usare un account separato"],answer:1,reason:"Account distinti proteggono i dati e rendono le attività attribuibili."},
];
export default function Task02Accounts(props:TaskContext){return <ChoiceGrid {...props} items={ITEMS} instruction="Assegna a ogni situazione il livello di accesso necessario, senza concedere più potere del necessario." success="Hai applicato il minimo privilegio: account standard per il lavoro normale ed elevazione soltanto per attività amministrative motivate."/>}
