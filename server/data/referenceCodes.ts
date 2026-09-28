export type ReferenceCategory = 'CARE_EVENT' | 'DEVICE_DRUG' | 'SUBSTITUTION_WATCHLIST' | 'INJURY' | 'COMPLICATION_LIST' | 'OTHER';

export interface ReferenceCodeRecord {
  id: string;
  code: string;
  description: string;
  category: ReferenceCategory;
  internalBand: 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6';
  scoreContribution: number;
  active: boolean;
  rationale: string;
  source: string;
  updatedAt: string;
}
