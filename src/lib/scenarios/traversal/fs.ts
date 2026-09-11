// Simulated virtual filesystem shared by Directory Traversal tasks.
// Nessuna richiesta reale: tutti i "file" sono stringhe in memoria.

export type VFile = { path: string; content: string; secret?: boolean };

export const VFS: Record<string, VFile> = {
  // Public web root
  "/var/www/html/index.html": {
    path: "/var/www/html/index.html",
    content: "<h1>Benvenuto su acme-portal</h1>",
  },
  "/var/www/html/about.html": {
    path: "/var/www/html/about.html",
    content: "<h1>Chi siamo</h1><p>ACME Srl, dal 1998.</p>",
  },
  "/var/www/html/contact.html": {
    path: "/var/www/html/contact.html",
    content: "<h1>Contatti</h1><p>info@acme.example</p>",
  },
  "/var/www/html/pages/note.txt": {
    path: "/var/www/html/pages/note.txt",
    content: "Nota pubblica: manutenzione programmata sabato.",
  },
  "/var/www/html/pages/faq.txt": {
    path: "/var/www/html/pages/faq.txt",
    content: "Domande frequenti sui nostri servizi...",
  },
  "/var/www/html/pages/press.txt": {
    path: "/var/www/html/pages/press.txt",
    content: "Comunicato stampa Q3: crescita del 12%.",
  },

  // App config (dovrebbe essere fuori dalla webroot)
  "/var/www/config/app.conf": {
    path: "/var/www/config/app.conf",
    secret: true,
    content:
      "APP_ENV=production\nDB_HOST=10.0.0.4\nDB_USER=acme_admin\nDB_PASS=Sup3rS3cret!2024\nSTRIPE_KEY=sk_live_9f2a7b1c4e8d",
  },
  "/var/www/config/.env": {
    path: "/var/www/config/.env",
    secret: true,
    content:
      "JWT_SECRET=b8e1f2a9c7d4e6f0a1b2c3d4e5f6a7b8\nMAIL_PASS=Postmaster!Acme\nOPENAI_API_KEY=sk-proj-XXXX-REDACTED",
  },

  // Unix classics
  "/etc/passwd": {
    path: "/etc/passwd",
    secret: true,
    content:
      "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nacme:x:1000:1000:ACME Admin:/home/acme:/bin/bash",
  },
  "/etc/shadow": {
    path: "/etc/shadow",
    secret: true,
    content:
      "root:$6$xy...$hash:19876:0:99999:7:::\nacme:$6$aa...$hash:19876:0:99999:7:::",
  },
  "/home/acme/.ssh/id_rsa": {
    path: "/home/acme/.ssh/id_rsa",
    secret: true,
    content:
      "-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAA...\n-----END OPENSSH PRIVATE KEY-----",
  },

  // Windows classics
  "C:/Windows/win.ini": {
    path: "C:/Windows/win.ini",
    secret: true,
    content:
      "; for 16-bit app support\n[fonts]\n[extensions]\n[mci extensions]\n[files]\n[Mail]\nMAPI=1",
  },
  "C:/Windows/System32/drivers/etc/hosts": {
    path: "C:/Windows/System32/drivers/etc/hosts",
    secret: true,
    content:
      "127.0.0.1 localhost\n10.0.0.4 db-internal\n10.0.0.9 backup-internal",
  },

  // Sorgente PHP con credenziali (per LFI)
  "/var/www/html/includes/db.php": {
    path: "/var/www/html/includes/db.php",
    secret: true,
    content:
      "<?php\n$DB_HOST = '10.0.0.4';\n$DB_USER = 'acme_admin';\n$DB_PASS = 'Sup3rS3cret!2024';\nmysqli_connect($DB_HOST, $DB_USER, $DB_PASS);",
  },
};

// -------- Resolver ----------

export type ResolveOpts = {
  base: string; // es. /var/www/html/pages
  decodeLevels?: number; // 0 = no decoding
  blockLiteralDotDot?: boolean; // rimuove i ".." *letterali* PRIMA del decoding
  acceptNullByte?: boolean; // se true, tronca al primo \0
  extensionWhitelist?: string[]; // se presente, il path finale deve terminare con una di queste estensioni (dopo eventuale null byte)
  // Se il path inizia con "/" o con "X:/" viene trattato come assoluto (nessun join con base)
};

// Semplice normalizzazione: risolve "." e ".." su segmenti, mantiene root ("/" o "X:/")
function normalize(pathIn: string): string {
  const isAbs = pathIn.startsWith("/");
  const winMatch = pathIn.match(/^([A-Za-z]):[\\/](.*)$/);
  let root = "";
  let rest = pathIn;
  if (winMatch) {
    root = `${winMatch[1]!.toUpperCase()}:/`;
    rest = winMatch[2]!;
  } else if (isAbs) {
    root = "/";
    rest = pathIn.slice(1);
  }
  const parts = rest.split(/[\\/]+/).filter(Boolean);
  const stack: string[] = [];
  for (const p of parts) {
    if (p === ".") continue;
    if (p === "..") {
      if (stack.length) stack.pop();
      continue;
    }
    stack.push(p);
  }
  return root + stack.join("/");
}

export function resolvePath(input: string, opts: ResolveOpts): string {
  let s = input;

  if (opts.blockLiteralDotDot) {
    // Rimuove segmenti ".." letterali (naïve) prima del decoding
    s = s.replace(/\.\.[\\/]/g, "").replace(/[\\/]\.\.(?=[\\/]|$)/g, "");
  }

  const levels = opts.decodeLevels ?? 0;
  for (let i = 0; i < levels; i++) {
    try {
      const decoded = decodeURIComponent(s);
      if (decoded === s) break;
      s = decoded;
    } catch {
      break;
    }
  }

  // Il server applica la whitelist di estensioni sulla stringa ricevuta…
  if (opts.extensionWhitelist && opts.extensionWhitelist.length) {
    const ok = opts.extensionWhitelist.some((ext) => s.toLowerCase().endsWith(ext.toLowerCase()));
    if (!ok) s = s + opts.extensionWhitelist[0]!;
  }

  // …ma la chiamata di sistema tronca al null byte (bug storico in C).
  if (opts.acceptNullByte) {
    const nb = s.indexOf("\u0000");
    if (nb >= 0) s = s.slice(0, nb);
  }

  const isAbs = s.startsWith("/") || /^[A-Za-z]:[\\/]/.test(s);
  const joined = isAbs ? s : `${opts.base.replace(/\/$/, "")}/${s}`;
  return normalize(joined);
}

export function lookup(path: string): VFile | undefined {
  return VFS[path];
}
