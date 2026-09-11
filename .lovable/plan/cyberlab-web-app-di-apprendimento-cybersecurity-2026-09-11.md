# CyberLab — Web app di apprendimento cybersecurity

Un percorso interattivo per principianti che simula scenari di attacco in modo guidato, visuale e sicuro (tutto simulato lato frontend). Stile elegante, nero, non "hacker". Parti graduale: prima solo IDOR, struttura pronta per gli altri 3 scenari.

## Cosa vedrà lo studente

- **Home**: presentazione del percorso, 4 categorie mostrate come "moduli" (IDOR attivo, gli altri 3 con etichetta "Prossimamente" ma già navigabili come placeholder).
- **Modulo IDOR** (attivo): pagina introduttiva animata che spiega il concetto con esempi visivi (badge utente, URL con `?id=123`, evidenziazioni). Poi ~10 micro-task progressivi, ognuno con:
  - Contesto breve
  - Ambiente simulato interattivo (es. finta dashboard con URL modificabile, elenchi di ordini, profili, fatture)
  - Obiettivo chiaro ("accedi al profilo dell'utente 42")
  - Feedback immediato (successo animato, hint se sbaglia)
  - Spiegazione finale del perché ha funzionato
- **Progresso**: barra di avanzamento, task completati salvati in `localStorage`, badge finale del modulo.
- **Animazioni**: transizioni tra task, micro-interazioni sui bottoni, evidenziatori animati su URL/parametri, effetto "unlock" al completamento.

## Micro-task IDOR (bozza dei 10)

1. Cos'è un ID in un URL — clicca e osserva
2. Cambia l'ID nell'URL per vedere un altro ordine
3. Trova la fattura di un altro utente
4. Accedi al profilo admin (id=1)
5. Scarica un documento non tuo cambiando il parametro
6. IDOR con ID nel body di una richiesta (form simulato)
7. IDOR con UUID indovinabile in sequenza
8. IDOR in API REST (`/api/users/{id}`)
9. Bypassare controllo lato client
10. Quiz finale + spiegazione mitigazioni (controllo autorizzazioni server-side)

I testi esatti li rifiniamo durante l'implementazione.

## Stile visivo

- Palette: nero profondo di sfondo, bianco/avorio per testo, un solo accento (proporrò 2-3 opzioni: oro tenue, rosso bordeaux, verde salvia) — niente verde-terminale, niente glitch.
- Tipografia editoriale (serif per titoli + sans moderno per testo), spazi ampi, bordi sottili, ombre morbide.
- Animazioni fluide (framer-motion): fade, slide, evidenziatori, celebrazioni al completamento.
- Zero estetica "matrix/hacker".

Dopo l'approvazione di questo piano genero 3 direzioni visive renderizzate tra cui scegliere.

## Struttura pronta per gli altri 3 scenari

Ogni modulo è definito da un file di configurazione con: titolo, descrizione, lista task. Aggiungere Directory Traversal, Reverse Shell, Reverse Engineering vorrà dire creare i rispettivi file di scenario e i componenti di simulazione specifici, senza toccare l'ossatura.

## Deploy

Configurata per **Netlify** (SPA statica, nessun backend necessario per lo scenario IDOR — è tutto simulato lato client). Test locale con il server di sviluppo già incluso. Nessun backend, nessun database, nessun costo aggiuntivo.

---

## Dettagli tecnici

- Stack: TanStack Start (già presente), React 19, Tailwind v4, framer-motion per animazioni, shadcn/ui per componenti base.
- Routing: `/` home, `/modules/idor` intro modulo, `/modules/idor/$taskId` singolo task. Struttura pronta per `/modules/directory-traversal`, `/modules/reverse-shell`, `/modules/reverse-engineering`.
- Stato progresso: `localStorage` (`cyberlab.progress`), hook `useProgress`.
- Scenari come dati: `src/lib/scenarios/idor.ts` esporta `{ id, title, intro, tasks: Task[] }`. Ogni `Task` ha `component` che renderizza la simulazione specifica (dashboard finta con URL param, form simulato, API mock, ecc.).
- Simulazioni IDOR: componenti React che mostrano finte UI (lista ordini, profili) con dati statici in memoria; l'interazione dello studente (modifica URL param locale via state, submit form) viene validata contro la condizione di successo del task.
- Netlify: `public/_redirects` con `/*  /index.html  200` per SPA fallback; nessuna config aggiuntiva (Vite build → `dist/`). Locale invariato.
- Nessuna dipendenza da Lovable Cloud in questa fase.

## Cosa faccio dopo l'approvazione

1. Genero 3 direzioni visive (nero elegante, accenti diversi) e ti chiedo di sceglierne una.
2. Implemento home + modulo IDOR completo con i 10 task nella direzione scelta.
3. Placeholder navigabili per gli altri 3 moduli.
4. Aggiungo `_redirects` per Netlify.
