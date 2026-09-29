import type {
  AnalyticsResponse,
  ClaimInput,
  HacInvestigation,
  ReferenceCodeRecord,
  ReferenceCodeResponse,
  ReviewerNote,
  ReviewOutcome,
  ReviewQueueResponse,
  SignalLevel,
  ReviewStatus,
} from './hacTypes';
import { SEED_DATA } from './sampleData';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace(/\/$/, '');

// Local session store for fallback mode
const STORAGE_KEY = 'hac_workflow_state_v1';

function getStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fallback to memory */
  }
  return {
    claims: [...SEED_DATA.claims],
    notes: [...SEED_DATA.notes],
    decisions: [...SEED_DATA.decisions],
    investigations: { ...SEED_DATA.investigations },
  };
}

function saveStoredState(state: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

let activeState = getStoredState();

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = 3500;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message || `Request failed with status ${response.status}`);
    }
    return response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);

    // If external/local backend is unreachable, fulfill request gracefully using client sample dataset
    console.warn(`[hacApi] Remote API (${path}) unreachable (${err?.message}). Serving from embedded sample dataset.`);
    const fallbackResult = handleClientFallback<T>(path, init);
    if (fallbackResult !== undefined) {
      return fallbackResult;
    }
    throw err;
  }
}

function handleClientFallback<T>(path: string, init?: RequestInit): T | undefined {
  const [pathname, queryString] = path.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Health
  if (pathname === '/health') {
    return {
      status: 'healthy',
      service: 'poa-hac-embedded-service',
      timestamp: new Date().toISOString(),
    } as unknown as T;
  }

  // 2. Review Queue
  if (pathname === '/hac/review-queue') {
    const search = (params.get('search') || '').toLowerCase();
    const level = params.get('signalLevel') as SignalLevel | '';
    const status = params.get('reviewStatus') as ReviewStatus | '';
    const page = Number(params.get('page')) || 1;
    const pageSize = Number(params.get('pageSize')) || 10;

    let items = (SEED_DATA.queue.items as readonly any[]).map(item => {
      const liveClaim = activeState.claims.find((c: any) => c.claimId === item.claimId);
      return {
        ...item,
        reviewStatus: liveClaim?.reviewStatus || item.reviewStatus,
      };
    });

    if (search) {
      items = items.filter(
        i =>
          i.claimId.toLowerCase().includes(search) ||
          i.patientId.toLowerCase().includes(search) ||
          i.providerDisplayName.toLowerCase().includes(search) ||
          i.hacDiagnosisCode.toLowerCase().includes(search) ||
          i.hacDiagnosisDescription.toLowerCase().includes(search)
      );
    }
    if (level) {
      items = items.filter(i => i.signalLevel === level);
    }
    if (status) {
      items = items.filter(i => i.reviewStatus === status);
    }

    const total = items.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = items.slice(startIndex, startIndex + pageSize);

    const highPriority = items.filter(i => i.signalLevel === 'HIGH').length;
    const inReview = items.filter(i => i.reviewStatus === 'IN_REVIEW').length;
    const confirmed = items.filter(i => i.reviewStatus === 'CONFIRMED').length;

    return {
      items: paginated,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
      summaryCounts: {
        total,
        highPriority,
        inReview,
        confirmed,
      },
    } as unknown as T;
  }

  // 3. Analytics
  if (pathname === '/hac/analytics') {
    return SEED_DATA.analytics as unknown as T;
  }

  // 4. Config
  if (pathname === '/hac/config') {
    return {
      thresholds: { midStayThresholdHours: 48, earlyWindowHours: 24, historyLookbackDays: 90, interventionScoreCap: 25 },
      signalLevelCutoffs: { high: 75, review: 50, monitor: 25 },
      componentWeights: { maxA: 20, maxB: 20, maxC: 20, maxD: 25, maxE: 15 },
      suppressors: { enableRecognizedProgressionCap: true, recognizedProgressionCap: 30, enableDifferentProviderCap: true, differentProviderCap: 15 },
    } as unknown as T;
  }

  // 5. Investigation
  const invMatch = pathname.match(/^\/hac\/claims\/([^/]+)\/investigation$/);
  if (invMatch) {
    const claimId = decodeURIComponent(invMatch[1]);
    const inv = activeState.investigations[claimId] || (SEED_DATA.investigations as any)[claimId];
    if (inv) return inv as unknown as T;
  }

  // 6. Notes
  const notesMatch = pathname.match(/^\/hac\/claims\/([^/]+)\/notes$/);
  if (notesMatch) {
    const claimId = decodeURIComponent(notesMatch[1]);
    if (init?.method === 'POST') {
      const body = JSON.parse((init.body as string) || '{}');
      const newNote = {
        id: `NOTE-${Date.now()}`,
        claimId,
        author: body.author || 'Reviewer',
        authorRole: body.authorRole || 'Auditor',
        content: body.content,
        createdAt: new Date().toISOString(),
      };
      activeState.notes.push(newNote);
      saveStoredState(activeState);
      return newNote as unknown as T;
    }
    const claimNotes = activeState.notes.filter((n: any) => n.claimId === claimId);
    return {
      claimId,
      totalNotes: claimNotes.length,
      notes: claimNotes,
    } as unknown as T;
  }

  // 7. Review Decision
  const reviewMatch = pathname.match(/^\/hac\/claims\/([^/]+)\/review$/);
  if (reviewMatch && init?.method === 'POST') {
    const claimId = decodeURIComponent(reviewMatch[1]);
    const body = JSON.parse((init.body as string) || '{}');
    const decision = {
      id: `DEC-${Date.now()}`,
      claimId,
      outcome: body.outcome,
      rationale: body.rationale,
      reviewerId: body.reviewerId,
      reviewerName: body.reviewerName,
      decidedAt: new Date().toISOString(),
    };
    activeState.decisions.push(decision);
    const targetClaim = activeState.claims.find((c: any) => c.claimId === claimId);
    if (targetClaim) {
      if (body.outcome === 'CONFIRM_CONCERN') targetClaim.reviewStatus = 'CONFIRMED';
      else if (body.outcome === 'NO_CONCERN') targetClaim.reviewStatus = 'RESOLVED';
      else if (body.outcome === 'MONITOR') targetClaim.reviewStatus = 'MONITORING';
      else targetClaim.reviewStatus = 'IN_REVIEW';
    }
    saveStoredState(activeState);
    return { message: 'Review decision successfully recorded.', decision } as unknown as T;
  }

  // 8. Single Claim
  const claimMatch = pathname.match(/^\/hac\/claims\/([^/]+)$/);
  if (claimMatch) {
    const claimId = decodeURIComponent(claimMatch[1]);
    const claim = activeState.claims.find((c: any) => c.claimId === claimId);
    if (claim) return claim as unknown as T;
  }

  // 9. Reference Codes
  if (pathname === '/hac/reference/codes') {
    return {
      items: [
        { id: '1', code: 'T81.4XXA', description: 'Infection following a procedure', category: 'SURGICAL_COMPLICATION', active: true },
        { id: '2', code: 'T83.511A', description: 'Infection from indwelling catheter', category: 'DEVICE_COMPLICATION', active: true },
        { id: '3', code: 'L89.152', description: 'Pressure ulcer of sacral region, stage 2', category: 'PRESSURE_INJURY', active: true },
        { id: '4', code: 'I26.99', description: 'Pulmonary embolism', category: 'THROMBOEMBOLISM', active: true },
      ],
      pagination: { page: 1, pageSize: 20, total: 4, totalPages: 1 },
    } as unknown as T;
  }

  return undefined;
}

export const hacApi = {
  health: () => request<{ status: string; service: string; timestamp: string }>('/health'),
  getInvestigation: (claimId: string) => request<HacInvestigation>(`/hac/claims/${encodeURIComponent(claimId)}/investigation`),
  getNotes: (claimId: string) =>
    request<{ claimId: string; totalNotes: number; notes: ReviewerNote[] }>(`/hac/claims/${encodeURIComponent(claimId)}/notes`),
  addNote: (claimId: string, payload: { author: string; authorRole: string; content: string }) =>
    request<ReviewerNote>(`/hac/claims/${encodeURIComponent(claimId)}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  submitReview: (
    claimId: string,
    payload: { outcome: ReviewOutcome; rationale: string; reviewerId: string; reviewerName: string }
  ) =>
    request<{ message: string; decision: any }>(`/hac/claims/${encodeURIComponent(claimId)}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getReviewQueue: (
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
      signalLevel?: SignalLevel | '';
      reviewStatus?: ReviewStatus | '';
    } = {}
  ) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') qs.set(key, String(value));
    });
    return request<ReviewQueueResponse>(`/hac/review-queue${qs.toString() ? `?${qs}` : ''}`);
  },
  getConfig: () => request<any>('/hac/config'),
  updateConfig: (config: any) => request<{ message: string; config: any }>('/hac/config', { method: 'PUT', body: JSON.stringify(config) }),
  getClaim: (claimId: string) => request<ClaimInput>(`/hac/claims/${encodeURIComponent(claimId)}`),
  createClaim: (claim: ClaimInput) =>
    request<{
      message: string;
      count: number;
      claims: ClaimInput[];
      investigationSummary?: { claimId: string; score: number; level: SignalLevel };
    }>('/hac/claims', { method: 'POST', body: JSON.stringify(claim) }),
  importClaims: (claims: ClaimInput[]) =>
    request<{ message: string; count: number; claims: ClaimInput[] }>('/hac/claims/upload', {
      method: 'POST',
      body: JSON.stringify({ claims }),
    }),
  updateClaim: (claimId: string, claim: ClaimInput) =>
    request<{ message: string; claim: ClaimInput; investigationSummary: { claimId: string; score: number; level: SignalLevel } }>(
      `/hac/claims/${encodeURIComponent(claimId)}`,
      { method: 'PUT', body: JSON.stringify(claim) }
    ),
  deleteClaim: (claimId: string) => request<{ message: string; claimId: string }>(`/hac/claims/${encodeURIComponent(claimId)}`, { method: 'DELETE' }),
  getAnalytics: () => request<AnalyticsResponse>('/hac/analytics'),
  getReferenceCodes: (params: { search?: string; category?: string; active?: string; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    });
    return request<ReferenceCodeResponse>(`/hac/reference/codes${qs.toString() ? `?${qs}` : ''}`);
  },
  createReferenceCode: (item: Partial<ReferenceCodeRecord>) =>
    request<{ message: string; item: ReferenceCodeRecord }>('/hac/reference/codes', { method: 'POST', body: JSON.stringify(item) }),
  importReferenceCodes: (items: Partial<ReferenceCodeRecord>[]) =>
    request<{ message: string; items: ReferenceCodeRecord[] }>('/hac/reference/codes/import', { method: 'POST', body: JSON.stringify({ items }) }),
  updateReferenceCode: (id: string, item: Partial<ReferenceCodeRecord>) =>
    request<{ message: string; item: ReferenceCodeRecord }>(`/hac/reference/codes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),
  deleteReferenceCode: (id: string) =>
    request<{ message: string; item: ReferenceCodeRecord }>(`/hac/reference/codes/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};
