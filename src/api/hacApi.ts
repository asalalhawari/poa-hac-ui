import type { AnalyticsResponse, ClaimInput, HacInvestigation, ReferenceCodeRecord, ReferenceCodeResponse, ReviewerNote, ReviewOutcome, ReviewQueueResponse, SignalLevel, ReviewStatus } from './hacTypes';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const hacApi = {
  health: () => request<{ status: string; service: string; timestamp: string }>('/health'),
  getInvestigation: (claimId: string) => request<HacInvestigation>(`/hac/claims/${encodeURIComponent(claimId)}/investigation`),
  getNotes: (claimId: string) => request<{ claimId: string; totalNotes: number; notes: ReviewerNote[] }>(`/hac/claims/${encodeURIComponent(claimId)}/notes`),
  addNote: (claimId: string, payload: { author: string; authorRole: string; content: string }) => request<ReviewerNote>(`/hac/claims/${encodeURIComponent(claimId)}/notes`, {
    method: 'POST', body: JSON.stringify(payload),
  }),
  submitReview: (claimId: string, payload: { outcome: ReviewOutcome; rationale: string; reviewerId: string; reviewerName: string }) => request<{ message: string; decision: any }>(`/hac/claims/${encodeURIComponent(claimId)}/review`, {
    method: 'POST', body: JSON.stringify(payload),
  }),
  getReviewQueue: (params: { page?: number; pageSize?: number; search?: string; signalLevel?: SignalLevel | ''; reviewStatus?: ReviewStatus | '' } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') qs.set(key, String(value)); });
    return request<ReviewQueueResponse>(`/hac/review-queue${qs.toString() ? `?${qs}` : ''}`);
  },
  getConfig: () => request<any>('/hac/config'),
  updateConfig: (config: any) => request<{ message: string; config: any }>('/hac/config', { method: 'PUT', body: JSON.stringify(config) }),
  getClaim: (claimId: string) => request<ClaimInput>(`/hac/claims/${encodeURIComponent(claimId)}`),
  createClaim: (claim: ClaimInput) => request<{ message: string; count: number; claims: ClaimInput[]; investigationSummary?: { claimId: string; score: number; level: SignalLevel } }>('/hac/claims', { method: 'POST', body: JSON.stringify(claim) }),
  importClaims: (claims: ClaimInput[]) => request<{ message: string; count: number; claims: ClaimInput[] }>('/hac/claims/upload', { method: 'POST', body: JSON.stringify({ claims }) }),
  updateClaim: (claimId: string, claim: ClaimInput) => request<{ message: string; claim: ClaimInput; investigationSummary: { claimId: string; score: number; level: SignalLevel } }>(`/hac/claims/${encodeURIComponent(claimId)}`, { method: 'PUT', body: JSON.stringify(claim) }),
  deleteClaim: (claimId: string) => request<{ message: string; claimId: string }>(`/hac/claims/${encodeURIComponent(claimId)}`, { method: 'DELETE' }),
  getAnalytics: () => request<AnalyticsResponse>('/hac/analytics'),
  getReferenceCodes: (params: {search?:string;category?:string;active?:string;page?:number;pageSize?:number}={}) => { const qs=new URLSearchParams(); Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!=='')qs.set(k,String(v))}); return request<ReferenceCodeResponse>(`/hac/reference/codes${qs.toString()?`?${qs}`:''}`); },
  createReferenceCode: (item: Partial<ReferenceCodeRecord>) => request<{message:string;item:ReferenceCodeRecord}>('/hac/reference/codes',{method:'POST',body:JSON.stringify(item)}),
  importReferenceCodes: (items: Partial<ReferenceCodeRecord>[]) => request<{message:string;items:ReferenceCodeRecord[]}>('/hac/reference/codes/import',{method:'POST',body:JSON.stringify({items})}),
  updateReferenceCode: (id:string,item:Partial<ReferenceCodeRecord>) => request<{message:string;item:ReferenceCodeRecord}>(`/hac/reference/codes/${encodeURIComponent(id)}`,{method:'PUT',body:JSON.stringify(item)}),
  deleteReferenceCode: (id:string) => request<{message:string;item:ReferenceCodeRecord}>(`/hac/reference/codes/${encodeURIComponent(id)}`,{method:'DELETE'}),
};
