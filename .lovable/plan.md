# Scenario Scansione con Nmap

## Obiettivo
Secondo scenario della metodologia di pentesting: **Scansione con Nmap**. Dopo l'Information Gathering, l'allievo passa dal semplice osservare al verificare attivamente cosa è raggiungibile, in quali condizioni e con quale livello di rumore. Focus concreto su Nmap, mantenendo tutto simulato e sicuro.

Slug: `nmap-scanning` · Categoria: **Metodologia Pentest** · Difficoltà: **Base** · Status: `available`.

## Le 10 attività
1. **Prima di lanciare: intento e rumore** — schierare cinque azioni tipiche di scansione su una bilancia "silenziosa ↔ rumorosa" e riconoscere quali richiedono autorizzazione esplicita.
2. **Anatomia di un comando nmap** — costruire un comando trascinando i pezzi (binario, timing, tipo di scan, porte, output, target) e leggere l'anteprima commentata token per token.
3. **Stati delle porte** — smistare risposte simulate (SYN/ACK, RST, nessuna risposta, ICMP unreachable) sui quattro stati `open`, `closed`, `filtered`, `open|filtered` con spiegazione visiva.
4. **Host discovery** — scegliere la modalità corretta di scoperta (ping ARP in LAN, ping TCP 443 su Internet, `-Pn` dove ICMP è bloccato) su tre reti diverse mostrate a mappa.
5. **TCP connect vs SYN scan** — animazione a due corsie del three-way handshake: `-sT` completa la stretta di mano, `-sS` la interrompe; l'allievo etichetta i pacchetti e sceglie il tipo giusto in tre contesti (senza root, con root, IDS presente).
6. **Timing e prudenza** — regolare uno slider `-T0…-T5` su tre bersagli (produzione fragile, laboratorio, finestra ristretta) osservando in tempo reale la stima di durata e il rischio di disturbo.
7. **Version detection e OS fingerprint** — aprire un mini-terminale simulato che accetta `-sV`, `-O`, `--version-intensity` e mostra righe di output realistiche; riconoscere quando un banner è affidabile e quando è solo un indizio.
8. **NSE, lo strumentario giusto** — catalogo a schede degli script (`default`, `safe`, `vuln`, `intrusive`, `brute`); selezionare quelli adatti a una prima ricognizione autorizzata ed escludere quelli invasivi.
9. **Dal comando al report** — laboratorio di output: eseguire una scansione simulata e scegliere il formato corretto (`-oN`, `-oX`, `-oG`, `-oA`) in base a tre esigenze (leggere a schermo, importare in un tool, cercare con `grep`).
10. **Triage finale della scansione** — dashboard con host e porte trovate: assegnare priorità (alta/media/bassa), motivare con le evidenze e proporre il prossimo passo autorizzato, chiudendo il percorso.

## Esperienza grafica
- Ogni attività ha una propria composizione: bilancia, costruttore di comandi, smistamento pacchetti, mappa di rete, corsie animate handshake, slider di timing, terminale a schede, catalogo NSE, laboratorio output, dashboard triage.
- Animazioni brevi (pacchetti, barre, connessioni) coerenti con lo stile esistente e rispettose del movimento ridotto.
- Testi originali, ricchi ma semplici, mai ripetitivi. Nessuna slide.
- Tutte le scansioni sono simulate: nessuna chiamata reale a rete o host esterni.

## Integrazione e verifica
- Registrare lo scenario in `src/lib/scenarios/index.ts` accanto agli altri.
- Mantenere progresso, riepilogo e reset già presenti nella piattaforma.
- Verifica: `bunx tsgo --noEmit` pulito, apertura scenario, completamento di almeno un paio di task interattivi, resa desktop e mobile.
