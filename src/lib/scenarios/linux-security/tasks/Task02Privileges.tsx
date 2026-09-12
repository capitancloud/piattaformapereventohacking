import type { TaskContext } from "../../types";
import { ChoiceGrid, type ChoiceItem } from "./ChoiceGrid";
const ITEMS: ChoiceItem[] = [
 { text: "Leggere un file nella propria cartella personale", options: ["Utente normale", "sudo", "root permanente"], answer: 0, reason: "Non serve aumentare i privilegi per un'operazione già consentita." },
 { text: "Installare un pacchetto ufficiale con apt", options: ["Utente normale", "sudo per il comando", "Accedere sempre come root"], answer: 1, reason: "L'installazione modifica il sistema: sudo concede il privilegio solo per quel comando." },
 { text: "Navigare sul web e leggere la posta", options: ["Sessione root", "Utente normale", "sudo su ogni comando"], answer: 1, reason: "Le attività quotidiane devono restare separate dai privilegi amministrativi." },
 { text: "Correggere un file di configurazione in /etc", options: ["sudo con attenzione", "Rendere /etc scrivibile a tutti", "Condividere la password di root"], answer: 0, reason: "Si autorizza soltanto l'azione necessaria, senza indebolire l'intera cartella." },
];
export default function Task02Privileges(props: TaskContext) { return <ChoiceGrid {...props} items={ITEMS} instruction="Applica il principio del minimo privilegio: usa soltanto i permessi necessari per l'azione corrente." success="Hai distinto bene lavoro quotidiano e amministrazione. Limitare root riduce gli effetti di errori e software dannoso." />; }
