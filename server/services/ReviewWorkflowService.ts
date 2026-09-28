import { randomUUID } from 'node:crypto';
import {
  ClaimEntity,
  CreateReviewerNoteRequestDTO,
  HumanReviewDecisionDTO,
  ReviewerNoteDTO,
  ReviewQueueFilterDTO,
  ReviewQueueItemDTO,
  ReviewQueueResponseDTO,
  ReviewStatus,
  SubmitReviewDecisionRequestDTO,
} from '../contracts/hac.types.js';
import { HacScoringService } from './HacScoringService.js';
import { PersistentJsonStore } from './PersistentJsonStore.js';

type WorkflowDb = {
  claims: ClaimEntity[];
  notes: ReviewerNoteDTO[];
  decisions: HumanReviewDecisionDTO[];
};

const EMPTY_DB: WorkflowDb = { claims: [], notes: [], decisions: [] };

export class ReviewWorkflowService {
  private static readDb(): WorkflowDb {
    return PersistentJsonStore.read<WorkflowDb>('workflow.json', EMPTY_DB);
  }

  private static writeDb(db: WorkflowDb) {
    PersistentJsonStore.write('workflow.json', db);
  }

  public static getClaim(claimId: string): ClaimEntity | undefined {
    return this.readDb().claims.find(c => c.claimId === claimId);
  }

  public static getAllClaims(): ClaimEntity[] {
    return this.readDb().claims;
  }

  private static requireText(value: unknown, field: string): string {
    const text = String(value ?? '').trim();
    if (!text) throw new Error(`${field} is required.`);
    return text;
  }

  private static validateIso(value: string | undefined, field: string, required = true): string | undefined {
    if (!value) {
      if (required) throw new Error(`${field} is required.`);
      return undefined;
    }
    const ms = new Date(value).getTime();
    if (!Number.isFinite(ms)) throw new Error(`${field} must be a valid ISO date-time.`);
    return new Date(ms).toISOString();
  }

  public static validateAndNormalizeClaim(raw: Partial<ClaimEntity>, existing?: ClaimEntity): ClaimEntity {
    const merged = { ...(existing || {}), ...raw } as Partial<ClaimEntity>;
    const claimId = this.requireText(merged.claimId, 'claimId');
    const patientId = this.requireText(merged.patientId, 'patientId');
    const providerId = this.requireText(merged.providerId, 'providerId');
    const providerFacilityCode = this.requireText(merged.providerFacilityCode, 'providerFacilityCode');
    const providerDisplayName = this.requireText(merged.providerDisplayName, 'providerDisplayName');
    const admissionDateTime = this.validateIso(merged.admissionDateTime, 'admissionDateTime', true)!;
    const dischargeDateTime = this.validateIso(merged.dischargeDateTime, 'dischargeDateTime', false);

    if (!merged.primaryDiagnosis?.code?.trim() || !merged.primaryDiagnosis?.description?.trim()) {
      throw new Error('primaryDiagnosis code and description are required.');
    }
    if (!Array.isArray(merged.diagnoses) || merged.diagnoses.length === 0) {
      throw new Error('At least one diagnosis is required.');
    }
    const suspected = merged.diagnoses.find(d => d.isSuspectedHacCondition);
    if (!suspected?.code?.trim() || !suspected.description?.trim()) {
      throw new Error('A suspected HAC diagnosis with code and description is required.');
    }

    const normalizeDiagnosis = (d: any) => ({
      ...d,
      code: this.requireText(d.code, 'diagnosis.code').toUpperCase(),
      description: this.requireText(d.description, 'diagnosis.description'),
      firstObservedDateTime: this.validateIso(d.firstObservedDateTime, 'diagnosis.firstObservedDateTime', false),
      isPrimaryAdmissionDiagnosis: Boolean(d.isPrimaryAdmissionDiagnosis),
      isSuspectedHacCondition: Boolean(d.isSuspectedHacCondition),
    });

    const diagnoses = merged.diagnoses.map(normalizeDiagnosis);
    const primaryDiagnosis = normalizeDiagnosis({ ...merged.primaryDiagnosis, isPrimaryAdmissionDiagnosis: true, isSuspectedHacCondition: false });
    const procedures = Array.isArray(merged.procedures) ? merged.procedures.map((p: any) => ({
      ...p,
      code: this.requireText(p.code, 'procedure.code').toUpperCase(),
      description: this.requireText(p.description, 'procedure.description'),
      performedDateTime: this.validateIso(p.performedDateTime, 'procedure.performedDateTime', false),
      isPlannedOnAdmission: Boolean(p.isPlannedOnAdmission),
    })) : [];

    const admissionMs = new Date(admissionDateTime).getTime();
    const dischargeMs = dischargeDateTime ? new Date(dischargeDateTime).getTime() : admissionMs;
    if (dischargeDateTime && dischargeMs < admissionMs) throw new Error('dischargeDateTime cannot be before admissionDateTime.');
    const lengthOfStayDays = dischargeDateTime ? Math.max(0, Math.round((dischargeMs - admissionMs) / 86400000)) : 0;

    return {
      claimId,
      patientId,
      patientAge: merged.patientAge,
      patientGender: merged.patientGender,
      providerId,
      providerFacilityCode,
      providerDisplayName,
      admissionDateTime,
      dischargeDateTime,
      lengthOfStayDays,
      primaryDiagnosis,
      diagnoses,
      procedures,
      patientHistory: Array.isArray(merged.patientHistory) ? merged.patientHistory : [],
      isPatientHistoryAvailable: Boolean(merged.isPatientHistoryAvailable),
      encounterType: merged.encounterType || 'INPATIENT',
      reviewStatus: merged.reviewStatus || 'NEW',
      assignedTo: merged.assignedTo?.trim() || undefined,
      isPalliativeCareDocumented: Boolean(merged.isPalliativeCareDocumented),
      isPlannedStagedProcedure: Boolean(merged.isPlannedStagedProcedure),
    };
  }

  public static addClaim(raw: Partial<ClaimEntity>): ClaimEntity {
    const db = this.readDb();
    const claim = this.validateAndNormalizeClaim(raw);
    if (db.claims.some(c => c.claimId === claim.claimId)) throw new Error(`Claim ${claim.claimId} already exists.`);
    db.claims.push(claim);
    this.writeDb(db);
    return claim;
  }

  public static addClaims(rawClaims: Partial<ClaimEntity>[]): ClaimEntity[] {
    const db = this.readDb();
    const created = rawClaims.map(raw => this.validateAndNormalizeClaim(raw));
    const incomingIds = new Set<string>();
    for (const claim of created) {
      if (incomingIds.has(claim.claimId)) throw new Error(`Duplicate claim ${claim.claimId} in import payload.`);
      incomingIds.add(claim.claimId);
      if (db.claims.some(c => c.claimId === claim.claimId)) throw new Error(`Claim ${claim.claimId} already exists.`);
    }
    db.claims.push(...created);
    this.writeDb(db);
    return created;
  }

  public static updateClaim(claimId: string, raw: Partial<ClaimEntity>): ClaimEntity {
    const db = this.readDb();
    const idx = db.claims.findIndex(c => c.claimId === claimId);
    if (idx < 0) throw new Error(`Claim ${claimId} not found`);
    const claim = this.validateAndNormalizeClaim({ ...db.claims[idx], ...raw, claimId }, db.claims[idx]);
    db.claims[idx] = claim;
    this.writeDb(db);
    return claim;
  }

  public static deleteClaim(claimId: string): void {
    const db = this.readDb();
    if (!db.claims.some(c => c.claimId === claimId)) throw new Error(`Claim ${claimId} not found`);
    db.claims = db.claims.filter(c => c.claimId !== claimId);
    db.notes = db.notes.filter(n => n.claimId !== claimId);
    db.decisions = db.decisions.filter(d => d.claimId !== claimId);
    this.writeDb(db);
  }

  public static addNote(claimId: string, req: CreateReviewerNoteRequestDTO): ReviewerNoteDTO {
    const db = this.readDb();
    if (!db.claims.some(c => c.claimId === claimId)) throw new Error(`Claim ${claimId} not found`);
    const author = this.requireText(req.author, 'author');
    const authorRole = this.requireText(req.authorRole, 'authorRole');
    const content = this.requireText(req.content, 'content');
    const note: ReviewerNoteDTO = { id: `NOTE-${randomUUID()}`, claimId, author, authorRole, content, createdAt: new Date().toISOString() };
    db.notes.push(note);
    this.writeDb(db);
    return note;
  }

  public static getNotes(claimId: string): ReviewerNoteDTO[] {
    return this.readDb().notes.filter(n => n.claimId === claimId);
  }

  public static submitDecision(claimId: string, req: SubmitReviewDecisionRequestDTO): HumanReviewDecisionDTO {
    const db = this.readDb();
    const idx = db.claims.findIndex(c => c.claimId === claimId);
    if (idx < 0) throw new Error(`Claim ${claimId} not found`);
    const reviewerId = this.requireText(req.reviewerId, 'reviewerId');
    const reviewerName = this.requireText(req.reviewerName, 'reviewerName');
    const rationale = this.requireText(req.rationale, 'rationale');
    const claim = db.claims[idx];
    const previousStatus = claim.reviewStatus;
    let newStatus: ReviewStatus = 'IN_REVIEW';
    switch (req.outcome) {
      case 'CONFIRM_CONCERN': newStatus = 'CONFIRMED'; break;
      case 'NO_CONCERN':
      case 'EXPECTED_PROGRESSION': newStatus = 'RESOLVED'; break;
      case 'NEED_MORE_INFORMATION': newStatus = 'NEED_MORE_INFORMATION'; break;
      case 'MONITOR': newStatus = 'MONITORING'; break;
      case 'ESCALATE':
      case 'ROUTE_OTHER_PROVIDER': newStatus = 'IN_REVIEW'; break;
    }
    claim.reviewStatus = newStatus;
    db.claims[idx] = claim;
    const decision: HumanReviewDecisionDTO = {
      id: `DEC-${randomUUID()}`, claimId, outcome: req.outcome, rationale,
      reviewerId, reviewerName, reviewedAt: new Date().toISOString(), previousStatus, newStatus,
    };
    db.decisions.push(decision);
    this.writeDb(db);
    return decision;
  }

  public static getLastDecision(claimId: string): HumanReviewDecisionDTO | undefined {
    const rows = this.readDb().decisions.filter(d => d.claimId === claimId);
    return rows.at(-1);
  }

  public static queryReviewQueue(filter: ReviewQueueFilterDTO): ReviewQueueResponseDTO {
    const page = Math.max(1, filter.page || 1);
    const pageSize = Math.max(1, Math.min(100, filter.pageSize || 10));
    let allQueueItems: ReviewQueueItemDTO[] = this.getAllClaims().map((claim) => {
      const notes = this.getNotes(claim.claimId);
      const lastDec = this.getLastDecision(claim.claimId);
      const investigation = HacScoringService.calculateInvestigation(claim, notes.length, lastDec?.outcome);
      const hacDiag = claim.diagnoses.find(d => d.isSuspectedHacCondition) || claim.primaryDiagnosis;
      return {
        claimId: claim.claimId, patientId: claim.patientId, admissionDateTime: claim.admissionDateTime,
        dischargeDateTime: claim.dischargeDateTime, primaryDiagnosisCode: claim.primaryDiagnosis.code,
        hacDiagnosisCode: hacDiag.code, score: investigation.signalResult.score,
        signalLevel: investigation.signalResult.level, encounterType: claim.encounterType,
        reviewStatus: claim.reviewStatus, providerId: claim.providerId,
        providerDisplayName: claim.providerDisplayName, assignedTo: claim.assignedTo,
        dataQualityStatus: investigation.dataQuality.overallStatus, notesCount: notes.length,
        lastDecision: lastDec?.outcome,
      };
    });
    const summaryCounts = {
      total: allQueueItems.length,
      highPriority: allQueueItems.filter(i => i.signalLevel === 'HIGH').length,
      inReview: allQueueItems.filter(i => i.reviewStatus === 'IN_REVIEW').length,
      confirmed: allQueueItems.filter(i => i.reviewStatus === 'CONFIRMED').length,
    };
    if (filter.search?.trim()) {
      const q = filter.search.trim().toLowerCase();
      allQueueItems = allQueueItems.filter(i => [i.claimId,i.patientId,i.primaryDiagnosisCode,i.hacDiagnosisCode,i.providerDisplayName].some(v => v.toLowerCase().includes(q)));
    }
    if (filter.signalLevel) allQueueItems = allQueueItems.filter(i => i.signalLevel === filter.signalLevel);
    if (filter.providerId) allQueueItems = allQueueItems.filter(i => i.providerId === filter.providerId);
    if (filter.reviewStatus) allQueueItems = allQueueItems.filter(i => i.reviewStatus === filter.reviewStatus);
    if (filter.assignedTo) allQueueItems = allQueueItems.filter(i => i.assignedTo === filter.assignedTo);
    if (filter.startDate) { const t=new Date(filter.startDate).getTime(); allQueueItems=allQueueItems.filter(i=>new Date(i.admissionDateTime).getTime()>=t); }
    if (filter.endDate) { const t=new Date(filter.endDate).getTime(); allQueueItems=allQueueItems.filter(i=>new Date(i.admissionDateTime).getTime()<=t); }
    const dir = filter.sortDirection === 'asc' ? 1 : -1;
    allQueueItems.sort((a,b)=> filter.sortBy==='admissionDateTime' ? (new Date(a.admissionDateTime).getTime()-new Date(b.admissionDateTime).getTime())*dir : filter.sortBy==='claimId' ? a.claimId.localeCompare(b.claimId)*dir : (a.score-b.score)*dir);
    const total = allQueueItems.length;
    const totalPages = Math.max(1, Math.ceil(total/pageSize));
    const items = allQueueItems.slice((page-1)*pageSize, page*pageSize);
    return { items, pagination:{page,pageSize,total,totalPages}, summaryCounts };
  }
}
