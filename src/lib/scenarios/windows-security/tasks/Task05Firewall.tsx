import type { TaskContext } from "../../types";
import { ChoiceGrid, type ChoiceItem } from "./ChoiceGrid";
const ITEMS:ChoiceItem[]=[
 {text:"Sei collegato al Wi-Fi di un aeroporto. Windows chiede il profilo di rete.",options:["Pubblica","Privata","Disattiva firewall"],answer:0,reason:"Il profilo pubblico applica regole più restrittive quando non conosci gli altri dispositivi della rete."},
 {text:"La condivisione file serve soltanto nella rete interna dell'ufficio.",options:["Consentila su tutte le reti","Consentila solo sul profilo privato","Apri ogni porta"],answer:1,reason:"Limitare la regola al profilo necessario riduce l'esposizione."},
 {text:"Un'app sconosciuta chiede una regola in ingresso su rete pubblica e privata.",options:["Consenti entrambe","Nega e verifica l'applicazione","Spegni Defender"],answer:1,reason:"Una richiesta ampia e inattesa richiede prima una verifica."},
 {text:"Un programma approvato non comunica dopo una modifica al firewall.",options:["Creare una regola precisa per app, porta e profilo","Disabilitare tutto il firewall","Consentire ogni connessione"],answer:0,reason:"Una regola mirata risolve il bisogno senza rimuovere la protezione generale."},
];
export default function Task05Firewall(props:TaskContext){return <ChoiceGrid {...props} items={ITEMS} instruction="Scegli il profilo e la regola più adatti a ogni contesto di rete." success="Hai mantenuto il firewall attivo e creato eccezioni limitate al programma, alla rete e allo scopo realmente necessari."/>}
