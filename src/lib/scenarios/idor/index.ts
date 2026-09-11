import type { Scenario } from "../types";
import Task01Observe from "./tasks/Task01Observe";
import Task02ChangeId from "./tasks/Task02ChangeId";
import Task03Invoice from "./tasks/Task03Invoice";
import Task04Admin from "./tasks/Task04Admin";
import Task05Download from "./tasks/Task05Download";
import Task06PostBody from "./tasks/Task06PostBody";
import Task07Uuid from "./tasks/Task07Uuid";
import Task08Api from "./tasks/Task08Api";
import Task09ClientBypass from "./tasks/Task09ClientBypass";
import Task10Quiz from "./tasks/Task10Quiz";

export const idorScenario: Scenario = {
  id: "idor",
  slug: "idor",
  title: "Vulnerabilità IDOR",
  subtitle: "Insecure Direct Object Reference",
  intro:
    "Quando un'applicazione espone un identificatore di risorsa (un numero, un UUID, un nome) e non verifica se hai il diritto di accedervi, chiunque conosca l'id può leggere o modificare dati altrui. Impareremo a riconoscere il pattern in URL, form e API.",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-osserva",
      title: "Osserva l'ID nell'URL",
      goal: "Capire cos'è un identificatore di risorsa",
      brief:
        "Ogni oggetto (ordine, fattura, profilo) ha un id. Nel browser lo vedi come parametro nella barra dell'URL. Impariamo a leggerlo.",
      hint: "Clicca 'Ordine successivo' e guarda il numero nell'URL cambiare.",
      explanation:
        "Gli id identificano risorse. Sono la chiave con cui il server ritrova un oggetto nel database. Nulla di sbagliato in sé — il problema nasce se il server non verifica chi li sta usando.",
      Simulation: Task01Observe,
    },
    {
      id: "02-cambia-id",
      title: "Cambia l'ID e leggi un altro ordine",
      goal: "Il tuo primo IDOR",
      brief:
        "Il tuo id ordine è 1042. Prova a modificarlo nell'URL e caricare l'ordine di un altro cliente.",
      hint: "Sostituisci 1042 con 1043, 1044 o 1045 e premi Carica.",
      explanation:
        "Nessun controllo di proprietà: qualunque cliente può leggere l'ordine di chiunque altro.",
      Simulation: Task02ChangeId,
    },
    {
      id: "03-fattura",
      title: "Trova la fattura di un altro utente",
      goal: "Ricerca manuale per id",
      brief:
        "Trova la fattura intestata a Marco Bianchi modificando il numero nell'URL /invoice/<id>.",
      hint: "I numeri validi sono vicini a 9040.",
      explanation:
        "Un attaccante può iterare tutti gli id (fuzzing) per costruire un intero database.",
      Simulation: Task03Invoice,
    },
    {
      id: "04-admin",
      title: "Escalation ad admin",
      goal: "Sfruttare id prevedibili",
      brief:
        "Nella maggior parte dei sistemi, id=1 è l'account creato per primo — spesso l'amministratore.",
      hint: "Cambia /profile/42 in /profile/1.",
      explanation:
        "Sequenza + mancanza di autorizzazione = privilege escalation. Preferisci UUID casuali.",
      Simulation: Task04Admin,
    },
    {
      id: "05-download",
      title: "Scarica un file riservato",
      goal: "IDOR su download",
      brief:
        "Un endpoint di download accetta l'id del file. Prova a scaricare un documento Riservato.",
      hint: "Prova doc=87.",
      explanation:
        "Ogni endpoint che serve contenuti deve verificare, per ogni richiesta, se l'utente corrente ha diritto a quel contenuto.",
      Simulation: Task05Download,
    },
    {
      id: "06-body",
      title: "IDOR nel body di una richiesta",
      goal: "Non solo URL",
      brief:
        "I form hanno campi nascosti. Cambia lo userId inviato e modifica un account che non è il tuo.",
      hint: "Metti 1 (admin) o 7 nel campo userId e salva.",
      explanation:
        "Il server dovrebbe ignorare lo userId inviato dal client e usare quello estratto dalla sessione autenticata.",
      Simulation: Task06PostBody,
    },
    {
      id: "07-uuid",
      title: "UUID prevedibili",
      goal: "Quando l'id sembra sicuro ma non lo è",
      brief:
        "Sequenze di codici lunghi possono comunque essere indovinabili. Prova a riscattare un voucher di un altro utente.",
      hint: "Il tuo id finisce con 0001. Prova 0002.",
      explanation:
        "Usa generatori crittograficamente sicuri (crypto.randomUUID, secrets.token_urlsafe).",
      Simulation: Task07Uuid,
    },
    {
      id: "08-api",
      title: "IDOR in API REST",
      goal: "Stessi principi, contesto diverso",
      brief:
        "Le API REST espongono id nell'URL. Le regole di autorizzazione valgono identiche.",
      hint: "Modifica /api/users/42 in /api/users/1 o /api/users/7 e invia.",
      explanation:
        "Nelle API il rischio è amplificato: nessuna UI a mediare, tutte le risorse sono direttamente indirizzabili.",
      Simulation: Task08Api,
    },
    {
      id: "09-client-bypass",
      title: "Bypassare un controllo lato client",
      goal: "Il browser non è una difesa",
      brief:
        "Un bottone \"disabled\" impedisce solo il click nel tuo browser. Con DevTools puoi rimuoverlo.",
      hint: "Spunta il bypass DevTools, cambia lo username in anna.rossi e clicca Elimina.",
      explanation:
        "Ogni controllo di autorizzazione va replicato sul server. Il client è cosmetica.",
      Simulation: Task09ClientBypass,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — mitigazioni",
      goal: "Consolidare i concetti",
      brief:
        "Tre domande sulle mitigazioni corrette. Rispondi a tutte per completare il modulo.",
      hint: "Pensa a: dove va fatto il controllo? Come genero gli id?",
      explanation:
        "Le tre regole d'oro: autorizzazione server-side, id non prevedibili, mai fidarsi del client.",
      Simulation: Task10Quiz,
    },
  ],
};
