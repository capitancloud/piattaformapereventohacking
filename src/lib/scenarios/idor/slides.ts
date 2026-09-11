import type { Slide } from "../types";

export const idorSlides: Slide[] = [
  {
    kicker: "Scenario 01 · Panoramica",
    title: "Vulnerabilità IDOR",
    body: "Insecure Direct Object Reference: quando l'app espone un id di risorsa e si dimentica di chiedersi «ma chi lo sta usando ha davvero il diritto di vederlo?».",
    accent: "gold",
    icon: "ShieldAlert",
  },
  {
    kicker: "Task 01 · Osserva",
    title: "Ogni cosa ha un id",
    body: "Ordini, fatture, profili, file: dentro l'app tutto è identificato da un numero o un codice. Impariamo prima a vederli — nella URL, nei form, nelle API.",
    bullets: ["Nessun attacco, solo occhio", "URL, query, cookie, body JSON", "È la base di tutto ciò che segue"],
    icon: "Eye",
  },
  {
    kicker: "Task 02 · Il primo IDOR",
    title: "Cambia l'id, leggi l'ordine di un altro",
    body: "Sei loggato come cliente. Modifichi 1042 in 1043 nella barra dell'URL — se il server non controlla il proprietario, ti mostra un ordine che non è tuo.",
    accent: "danger",
    icon: "MousePointerClick",
  },
  {
    kicker: "Task 03 · Enumeration",
    title: "Da un id a mille",
    body: "Un attaccante non prova un solo numero: itera migliaia di id con uno script (id fuzzing) e in pochi minuti scarica intere basi dati.",
    bullets: ["Id sequenziali = target ideale", "Fatture, contratti, buste paga", "Rischio GDPR reale"],
    accent: "danger",
    icon: "Layers",
  },
  {
    kicker: "Task 04 · Privilege escalation",
    title: "id = 1 è quasi sempre l'admin",
    body: "IDOR + id prevedibili = scalata dei privilegi. Il primo utente creato è quasi sempre l'amministratore. Provi a caricare /profile/1 e ti apre il pannello sbagliato.",
    accent: "danger",
    icon: "Crown",
  },
  {
    kicker: "Task 05-06 · Dove si nasconde",
    title: "Non solo URL: form e body",
    body: "Un IDOR può stare in un campo hidden, in un JSON POST, in un header. Tutto ciò che parte dal browser è manipolabile con DevTools o Burp.",
    bullets: ["/download?doc=87", "userId hidden nei form", "«Never trust the client»"],
    icon: "Boxes",
  },
  {
    kicker: "Task 07 · UUID",
    title: "Anche gli id lunghi possono ingannare",
    body: "Un UUID non è magico: se generato male (contatori, timestamp, RNG debole) resta indovinabile. Serve casualità crittografica, non solo lunghezza.",
    bullets: ["crypto.randomUUID()", "gen_random_uuid() in PostgreSQL", "Difesa in profondità, non sostituto"],
    icon: "Fingerprint",
  },
  {
    kicker: "Task 08 · API REST",
    title: "Stesso attacco, contesto più veloce",
    body: "Le API espongono direttamente le risorse: GET /api/users/42. Nessuna UI a mediare, nessun rallentamento — il rischio è amplificato.",
    accent: "danger",
    icon: "Network",
  },
  {
    kicker: "Task 09 · Client bypass",
    title: "Il browser non è una difesa",
    body: "Un bottone «disabled» blocca solo il click nel tuo browser. Con DevTools lo togli in due secondi. Se il server non ricontrolla, l'azione parte lo stesso.",
    icon: "Unlock",
  },
  {
    kicker: "Task 10 · Sintesi",
    title: "Le tre regole d'oro",
    bullets: [
      "1 · Autorizzazione sempre lato server, per ogni richiesta",
      "2 · Id non prevedibili (UUID casuali, chiavi opache)",
      "3 · Mai fidarsi del client: form, header, JS, tutto è manipolabile",
    ],
    body: "Dieci domande finali per fissare i concetti. Poi si passa alla pratica.",
    accent: "success",
    icon: "ShieldCheck",
  },
];
