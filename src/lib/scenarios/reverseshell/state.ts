/**
 * Stato in-memory condiviso fra i task dello scenario Reverse Shell.
 * Tutto simulato: nessuna vera rete, nessun vero server, nessun vero shell.
 */

export interface UploadedFile {
  name: string;
  content: string;
  uploadedAt: number;
}

const state = {
  uploads: [] as UploadedFile[],
  listenerPort: null as number | null,
  listenerActive: false,
  shellOpen: false,
};

export function resetReverseShellState() {
  state.uploads = [];
  state.listenerPort = null;
  state.listenerActive = false;
  state.shellOpen = false;
}

export function uploadFile(f: UploadedFile) {
  state.uploads = [...state.uploads.filter((u) => u.name !== f.name), f];
}

export function findUpload(name: string) {
  return state.uploads.find((u) => u.name === name);
}

export function setListener(port: number | null) {
  state.listenerPort = port;
  state.listenerActive = port !== null;
}

export function getListener() {
  return { port: state.listenerPort, active: state.listenerActive };
}

export function openShell() {
  state.shellOpen = true;
}
export function isShellOpen() {
  return state.shellOpen;
}
