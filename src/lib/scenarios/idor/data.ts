export const ME = { id: 42, name: "Giulia Ferrari", email: "giulia.ferrari@demo.it" };

export interface OrderRec {
  id: number;
  owner: string;
  item: string;
  total: string;
  address: string;
}

export const ORDERS: Record<number, OrderRec> = {
  1041: {
    id: 1041,
    owner: "Giulia Ferrari",
    item: "Cuffie over-ear",
    total: "€ 149,00",
    address: "Via Manzoni 12, Milano",
  },
  1042: {
    id: 1042,
    owner: "Giulia Ferrari",
    item: "Tastiera meccanica",
    total: "€ 89,90",
    address: "Via Manzoni 12, Milano",
  },
  1043: {
    id: 1043,
    owner: "Marco Bianchi",
    item: "Monitor 27\" 4K",
    total: "€ 429,00",
    address: "Corso Vittorio 88, Torino",
  },
  1044: {
    id: 1044,
    owner: "Sara Colombo",
    item: "Poltrona ergonomica",
    total: "€ 610,00",
    address: "Piazza Dante 3, Napoli",
  },
  1045: {
    id: 1045,
    owner: "Luca Greco",
    item: "Tablet 11\"",
    total: "€ 799,00",
    address: "Via Etnea 210, Catania",
  },
};

export const MY_ORDERS = [1041, 1042];

export interface InvoiceRec {
  id: number;
  owner: string;
  amount: string;
  iban: string;
}

export const INVOICES: Record<number, InvoiceRec> = {
  9040: { id: 9040, owner: "Giulia Ferrari", amount: "€ 89,90", iban: "IT60•••••••••1234" },
  9041: { id: 9041, owner: "Anna Rossi", amount: "€ 240,00", iban: "IT60•••••••••7781" },
  9042: { id: 9042, owner: "Marco Bianchi", amount: "€ 429,00", iban: "IT12•••••••••5590" },
  9043: { id: 9043, owner: "Sara Colombo", amount: "€ 610,00", iban: "IT44•••••••••2210" },
};

export interface ProfileRec {
  id: number;
  name: string;
  role: string;
  email: string;
  secret: string;
}

export const PROFILES: Record<number, ProfileRec> = {
  1: {
    id: 1,
    name: "root.admin",
    role: "Amministratore di sistema",
    email: "admin@demo.it",
    secret: "API key: sk_live_9f3c•••••••b21",
  },
  7: {
    id: 7,
    name: "Anna Rossi",
    role: "Responsabile HR",
    email: "anna.rossi@demo.it",
    secret: "Livello retributivo: L5",
  },
  42: {
    id: 42,
    name: "Giulia Ferrari",
    role: "Cliente",
    email: "giulia.ferrari@demo.it",
    secret: "Nessun dato riservato",
  },
};

export interface DocRec {
  id: number;
  name: string;
  owner: string;
  classification: string;
}

export const DOCS: Record<number, DocRec> = {
  86: { id: 86, name: "Verbale_riunione.pdf", owner: "Ufficio Legale", classification: "Interno" },
  87: {
    id: 87,
    name: "Stipendi_2026_Q1.xlsx",
    owner: "Ufficio HR",
    classification: "Riservato",
  },
  88: { id: 88, name: "Ricevuta_ordine_1042.pdf", owner: "Giulia Ferrari", classification: "Personale" },
  89: { id: 89, name: "Contratto_fornitore.pdf", owner: "Acquisti", classification: "Riservato" },
};
