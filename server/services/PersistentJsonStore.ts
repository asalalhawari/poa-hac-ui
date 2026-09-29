import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let RUNTIME_DIR = path.resolve(__dirname, '../data/runtime');

function resolveWritableDir(): string {
  try {
    if (!fs.existsSync(RUNTIME_DIR)) fs.mkdirSync(RUNTIME_DIR, { recursive: true });
    fs.accessSync(RUNTIME_DIR, fs.constants.W_OK);
    return RUNTIME_DIR;
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'poa-hac-runtime');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    return tmpDir;
  }
}

export class PersistentJsonStore {
  private static memoryStore: Record<string, string> = {};

  static ensureRuntimeDir() {
    RUNTIME_DIR = resolveWritableDir();
  }

  static read<T>(fileName: string, fallback: T): T {
    try {
      this.ensureRuntimeDir();
      const file = path.join(RUNTIME_DIR, fileName);
      if (!fs.existsSync(file)) {
        try { fs.writeFileSync(file, JSON.stringify(fallback, null, 2)); } catch { /* ignore */ }
        return fallback;
      }
      const raw = fs.readFileSync(file, 'utf8').trim();
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      if (this.memoryStore[fileName]) {
        return JSON.parse(this.memoryStore[fileName]) as T;
      }
      return fallback;
    }
  }

  static write<T>(fileName: string, value: T) {
    const serialized = JSON.stringify(value, null, 2);
    this.memoryStore[fileName] = serialized;
    try {
      this.ensureRuntimeDir();
      const file = path.join(RUNTIME_DIR, fileName);
      const tmp = `${file}.tmp`;
      fs.writeFileSync(tmp, serialized);
      fs.renameSync(tmp, file);
    } catch {
      // In-memory fallback is active
    }
  }
}
