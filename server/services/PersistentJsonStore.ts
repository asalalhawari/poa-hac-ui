import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUNTIME_DIR = path.resolve(__dirname, '../data/runtime');

export class PersistentJsonStore {
  static ensureRuntimeDir() {
    if (!fs.existsSync(RUNTIME_DIR)) fs.mkdirSync(RUNTIME_DIR, { recursive: true });
  }

  static read<T>(fileName: string, fallback: T): T {
    this.ensureRuntimeDir();
    const file = path.join(RUNTIME_DIR, fileName);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const raw = fs.readFileSync(file, 'utf8').trim();
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  }

  static write<T>(fileName: string, value: T) {
    this.ensureRuntimeDir();
    const file = path.join(RUNTIME_DIR, fileName);
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
    fs.renameSync(tmp, file);
  }
}
