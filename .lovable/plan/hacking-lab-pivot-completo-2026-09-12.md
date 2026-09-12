# Hacking Lab — pivot completo

Trasformo il progetto in **Hacking Lab**, piattaforma di simulazione di scenari di ethical hacking. Rimuovo tutto il tema Black Mirror, cambio identità visiva (Deep Violet), rimuovo le slide da tutti gli scenari e riparto con **Networking** come primo scenario dei 20 previsti.

## Cosa cambia

### Identità e home
- Nuovo nome: **Hacking Lab** (header, titolo, meta SEO di ogni route).
- Home riscritta da zero: niente più riferimenti a Black Mirror, laboratorio o evento live. Testo neutro: piattaforma per imparare ethical hacking con scenari pratici interattivi.
- Nuova palette **Deep Violet**: sfondo viola notte `#0F0B1E`, primario viola `#6D28D9`, accento lavanda `#A78BFA`, testo `#F1F5F9`. Sostituisce completamente nero + oro.
- Tipografia rinnovata per staccare dal look attuale (sans moderna + display geometrica).
- Card scenari ridisegnate nella nuova palette.

### Scenari
- In home mostro **solo Networking** come scenario attivo + una card generica "Altri scenari in arrivo".
- Rimuovo i 4 scenari precedenti (IDOR, Directory Traversal, Reverse Shell IIS, Reverse Engineering) e i relativi file di route.
- **Rimuovo completamente le slide**: elimino la route `/slide/[id]`, i file `slides.tsx` di ogni scenario, i pulsanti "Avvia slide" da home e intro. Restano solo i task.

### Scenario Networking (10 micro-task interattivi)
Focus: concetti fondamentali di reti. Ogni task ha descrizione estesa + interazione, poi quiz finale.

1. **Indirizzo IP** — cos'è, IPv4 vs IPv6, classi. Interazione: input per validare/classificare IP.
2. **Subnetting base** — maschera, CIDR. Interazione: slider CIDR che mostra range host in tempo reale.
3. **Indirizzo MAC** — cos'è, formato, OUI. Interazione: parser MAC che riconosce il vendor da OUI di esempio.
4. **ARP** — come un IP diventa MAC nella LAN. Interazione: simulazione tabella ARP con richiesta/risposta animata.
5. **Switch** — forwarding L2, MAC table. Interazione: click su porte per vedere come lo switch impara i MAC.
6. **Router** — routing L3, routing table. Interazione: pacchetto che attraversa più router con hop visualizzati.
7. **NAT** — SNAT/PAT, LAN → Internet. Interazione: tabella NAT che si aggiorna con connessioni simulate.
8. **DNS** — risoluzione ricorsiva. Interazione: animazione query root → TLD → authoritative.
9. **Porte e servizi** — TCP/UDP, well-known ports. Interazione: mini port-scanner simulato su host di esempio.
10. **Quiz finale** — 10 domande a scelta multipla non troppo difficili.

Progresso salvato in localStorage per scenario, con pulsante "Azzera progresso" nella card home (invariato).

## Dettagli tecnici

- Palette in `src/styles.css` via `@theme`: aggiorno i token `--color-*` (background, primary, accent, foreground, muted, border) sui valori Deep Violet. shadcn continua a funzionare tramite `@theme inline`.
- Struttura route invariata: `src/routes/_layout/scenarios/networking/index.tsx` + `intro.tsx` + `home-card.tsx`. Rimuovo `slides.tsx`.
- Elimino cartelle: `scenarios/idor/`, `scenarios/directory-traversal/`, `scenarios/reverse-shell-iis/`, `scenarios/reverse-engineering/`, `routes/_layout/slide/`.
- Registry scenari aggiornato: solo `networking` attivo, entry "coming soon" statica.
- Codice di accesso (`blackmirrorlab`) e pulsante Esci: **mantengo la meccanica**, cambio solo il codice? — da confermare, per ora **lascio invariato** finché non mi dici il nuovo codice.
- SEO: titolo/description/og di ogni route riscritti su Hacking Lab.

## Fuori scope (per ora)
- Elenco/implementazione degli altri 19 scenari.
- Backend / salvataggio progressi lato server.
- Modifica del codice d'accesso (dimmelo se vuoi cambiarlo).
