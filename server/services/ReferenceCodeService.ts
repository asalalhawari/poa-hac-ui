import { randomUUID } from 'node:crypto';
import { ReferenceCategory, ReferenceCodeRecord } from '../data/referenceCodes.js';
import { PersistentJsonStore } from './PersistentJsonStore.js';

const EMPTY: ReferenceCodeRecord[] = [];

export class ReferenceCodeService {
  private static read(): ReferenceCodeRecord[] { return PersistentJsonStore.read('reference-codes.json', EMPTY); }
  private static write(rows: ReferenceCodeRecord[]) { PersistentJsonStore.write('reference-codes.json', rows); }

  static list(params: { search?: string; category?: string; active?: string; page?: number; pageSize?: number }) {
    let rows = this.read();
    const q = (params.search || '').trim().toLowerCase();
    if (q) rows = rows.filter(r => [r.code,r.description,r.rationale,r.source].some(v => v.toLowerCase().includes(q)));
    if (params.category && params.category !== 'ALL') rows = rows.filter(r => r.category === params.category);
    if (params.active === 'true') rows = rows.filter(r => r.active);
    if (params.active === 'false') rows = rows.filter(r => !r.active);
    rows.sort((a,b)=>a.code.localeCompare(b.code));
    const page = Math.max(1, params.page || 1), pageSize = Math.max(1, Math.min(100, params.pageSize || 20));
    const total = rows.length, totalPages = Math.max(1, Math.ceil(total / pageSize));
    return { items: rows.slice((page-1)*pageSize, page*pageSize), pagination: { page, pageSize, total, totalPages }, categories: ['CARE_EVENT','DEVICE_DRUG','SUBSTITUTION_WATCHLIST','INJURY','COMPLICATION_LIST','OTHER'] as ReferenceCategory[] };
  }

  static findByCode(code:string) { const key=code.trim().toUpperCase(); return this.read().find(r=>r.active && r.code.toUpperCase()===key); }

  static create(input: Partial<ReferenceCodeRecord>) {
    if (!input.code?.trim() || !input.description?.trim() || !input.category || !input.internalBand || !input.rationale?.trim() || !input.source?.trim()) {
      throw new Error('Code, description, category, internal band, rationale and source are required.');
    }
    const rows = this.read();
    const code = input.code.trim().toUpperCase();
    if (rows.some(r => r.code.toUpperCase() === code)) throw new Error(`Reference code ${code} already exists.`);
    const rec: ReferenceCodeRecord = {
      id: `REF-${randomUUID()}`, code, description: input.description.trim(), category: input.category,
      internalBand: input.internalBand, scoreContribution: Number(input.scoreContribution ?? 0), active: input.active ?? true,
      rationale: input.rationale.trim(), source: input.source.trim(), updatedAt: new Date().toISOString()
    };
    rows.push(rec); this.write(rows); return rec;
  }

  static createMany(inputs: Partial<ReferenceCodeRecord>[]) {
    if (!Array.isArray(inputs) || inputs.length === 0) throw new Error('At least one reference record is required.');
    const rows = this.read();
    const seen = new Set(rows.map(r => r.code.toUpperCase()));
    const created = inputs.map(input => {
      if (!input.code?.trim() || !input.description?.trim() || !input.category || !input.internalBand || !input.rationale?.trim() || !input.source?.trim()) {
        throw new Error('Every imported record requires code, description, category, internalBand, rationale and source.');
      }
      const code = input.code.trim().toUpperCase();
      if (seen.has(code)) throw new Error(`Reference code ${code} already exists or is duplicated in the import.`);
      seen.add(code);
      return {
        id: `REF-${randomUUID()}`, code, description: input.description.trim(), category: input.category,
        internalBand: input.internalBand, scoreContribution: Number(input.scoreContribution ?? 0), active: input.active ?? true,
        rationale: input.rationale.trim(), source: input.source.trim(), updatedAt: new Date().toISOString()
      } as ReferenceCodeRecord;
    });
    rows.push(...created); this.write(rows); return created;
  }

  static update(id: string, input: Partial<ReferenceCodeRecord>) {
    const rows = this.read(); const idx = rows.findIndex(r => r.id === id); if (idx < 0) throw new Error('Reference code not found.');
    const next = { ...rows[idx], ...input, id, code: (input.code ?? rows[idx].code).trim().toUpperCase(), updatedAt: new Date().toISOString() } as ReferenceCodeRecord;
    if (!next.code || !next.description || !next.category || !next.internalBand || !next.rationale?.trim() || !next.source?.trim()) throw new Error('Code, description, category, internal band, rationale and source are required.');
    if (rows.some((r,i)=>i!==idx && r.code.toUpperCase()===next.code.toUpperCase())) throw new Error(`Reference code ${next.code} already exists.`);
    rows[idx]=next; this.write(rows); return next;
  }

  static remove(id:string) { const rows=this.read(); const found=rows.find(r=>r.id===id); if(!found) throw new Error('Reference code not found.'); this.write(rows.filter(r=>r.id!==id)); return found; }
}
