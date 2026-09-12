import type { TaskContext } from "../../types";
import { ChoiceGrid, type ChoiceItem } from "./ChoiceGrid";
const ITEMS: ChoiceItem[]=[
 {text:"Perché si installano le patch di sicurezza?",options:["Per correggere vulnerabilità note","Per cancellare gli utenti","Per aprire nuove porte"],answer:0},
 {text:"Qual è il modo più prudente di eseguire un solo comando amministrativo?",options:["Restare sempre root","Usare sudo per quel comando","Dare permessi 777"],answer:1},
 {text:"Quale permesso è adatto a un file di credenziali privato?",options:["600","777","666"],answer:0},
 {text:"Cosa riduce la superficie di attacco?",options:["Attivare ogni servizio","Disattivare i servizi inutili","Nascondere il nome del server"],answer:1},
 {text:"Cosa significa la regola predefinita deny incoming?",options:["Blocca gli ingressi non consentiti","Blocca tutti gli aggiornamenti","Elimina la rete"],answer:0},
 {text:"Quale scelta rende SSH più sicuro?",options:["Accesso root con password","Chiavi e accesso root vietato","Telnet di riserva"],answer:1},
 {text:"Quale sequenza nei log è più sospetta?",options:["Un logout normale","Molti errori rapidi dallo stesso IP","Un accesso con chiave riuscito"],answer:1},
 {text:"Un processo sconosciuto è sempre malware?",options:["Sì","No, servono più indizi","Solo se usa poca CPU"],answer:1},
 {text:"Quale comando mostra le porte in ascolto?",options:["ss -tulpn","pwd","mkdir"],answer:0},
 {text:"Qual è una buona abitudine di sicurezza?",options:["Controllare regolarmente aggiornamenti, servizi e accessi","Ignorare i log","Usare root per tutto"],answer:0},
];
export default function Task10Quiz(props:TaskContext){return <ChoiceGrid {...props} items={ITEMS} minimum={7} instruction="Rispondi a tutte le domande. Per completare il modulo bastano almeno 7 risposte corrette su 10." success="Scenario completato: sai applicare i primi controlli essenziali per mantenere un sistema Linux più sicuro e riconoscere segnali semplici di rischio."/>}
