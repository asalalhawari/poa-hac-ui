export type SignalLevel = 'HIGH' | 'REVIEW' | 'MONITOR' | 'NONE';
export type ReviewStatus = 'NEW' | 'IN_REVIEW' | 'NEED_MORE_INFORMATION' | 'CONFIRMED' | 'RESOLVED' | 'MONITORING';
export type ReviewOutcome = 'CONFIRM_CONCERN' | 'NO_CONCERN' | 'NEED_MORE_INFORMATION' | 'EXPECTED_PROGRESSION' | 'ROUTE_OTHER_PROVIDER' | 'MONITOR' | 'ESCALATE';

export interface FindingCard {
  key: 'timing' | 'path' | 'intervention' | 'coding' | 'history';
  title: string;
  headline: string;
  summary: string;
  level: string;
  tone: 'high' | 'critical' | 'medium' | 'neutral' | 'positive';
  points: number;
  maxPoints: number;
}

export interface TimelineEvent {
  id: string;
  dateTime: string;
  formattedDateTime: string;
  elapsedHours: number | null;
  eventType: string;
  title: string;
  subtitle: string;
  status: 'normal' | 'warning' | 'critical' | 'positive';
  details: string[];
  code?: string;
}

export interface HacInvestigation {
  claimId: string;
  patientId: string;
  patientAge?: number;
  patientGender?: 'M' | 'F' | 'OTHER';
  provider: { id: string; facilityCode: string; displayName: string };
  stayTimestamps: { admissionDateTime: string; dischargeDateTime?: string; lengthOfStayDays: number };
  signalResult: {
    score: number;
    level: SignalLevel;
    action: 'HUMAN_REVIEW';
    summaryHeadline: string;
    summaryDescription: string;
  };
  findingsCards: FindingCard[];
  technicalBreakdown: {
    rows: Array<{ component: string; label: string; bandAndDescription: string; scoreDisplay: string; points: number; maxPoints: number }>;
    componentA: any;
    componentB: any;
    componentC: any;
    componentD: any;
    componentE: any;
  };
  timeline: TimelineEvent[];
  clinicalPath: {
    expected: string[];
    actual: string[];
    divergencePoint: string;
    similarityPercent: number | null;
    deviationConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | null;
    aiEvidenceAvailable: boolean;
    aiEvidenceStatus: 'AI_MODEL' | 'NOT_CONNECTED';
  };
  dataQuality: {
    overallStatus: 'COMPLETE' | 'PARTIAL' | 'DEGRADED';
    isReliable: boolean;
    flags: Array<{ code: string; severity: 'CRITICAL' | 'WARNING' | 'INFO'; field: string; message: string; mitigation: string }>;
  };
  suppressors: {
    rawScore: number;
    finalScore: number;
    applied: Array<{ suppressorId: string; name: string; triggered: boolean; scoreBeforeSuppression: number; scoreAfterSuppression: number; reasoning: string }>;
    isScoreCapped: boolean;
  };
  workflow: { reviewStatus: ReviewStatus; assignedTo?: string; notesCount: number; lastDecision?: ReviewOutcome };
  audit: { modelVersion: string; rulesVersion: string; calculatedAt: string; dataVersion: string; calculationHash: string };
}

export interface ReviewQueueItem {
  claimId: string;
  patientId: string;
  admissionDateTime: string;
  dischargeDateTime?: string;
  primaryDiagnosisCode: string;
  hacDiagnosisCode: string;
  score: number;
  signalLevel: SignalLevel;
  encounterType?: 'INPATIENT' | 'OUTPATIENT';
  reviewStatus: ReviewStatus;
  providerId: string;
  providerDisplayName: string;
  assignedTo?: string;
  dataQualityStatus: 'COMPLETE' | 'PARTIAL' | 'DEGRADED';
  notesCount: number;
  lastDecision?: ReviewOutcome;
}

export interface ReviewQueueResponse {
  items: ReviewQueueItem[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  summaryCounts: { total: number; highPriority: number; inReview: number; confirmed: number };
}

export interface ReviewerNote {
  id: string;
  claimId: string;
  author: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface ClaimDiagnosisInput {
  code: string;
  description: string;
  isPrimaryAdmissionDiagnosis: boolean;
  isSuspectedHacCondition: boolean;
  firstObservedDateTime?: string;
}

export interface ClaimProcedureInput {
  code: string;
  description: string;
  performedDateTime?: string;
  isPlannedOnAdmission: boolean;
  isReturnToTheatre?: boolean;
  isRescueIntervention?: boolean;
  isImagingOrDiagnostic?: boolean;
  requiresPreApproval?: boolean;
  preApprovalObtained?: boolean;
  isRescueDrug?: boolean;
  specialtyShift?: boolean;
  hasAbnormalResult?: boolean;
  classificationAvailable?: boolean;
}

export interface ClaimInput {
  claimId?: string;
  patientId: string;
  patientAge?: number;
  patientGender?: 'M' | 'F' | 'OTHER';
  providerId: string;
  providerFacilityCode: string;
  providerDisplayName: string;
  admissionDateTime: string;
  dischargeDateTime?: string;
  lengthOfStayDays?: number;
  encounterType?: 'INPATIENT' | 'OUTPATIENT';
  primaryDiagnosis: ClaimDiagnosisInput;
  diagnoses: ClaimDiagnosisInput[];
  procedures: ClaimProcedureInput[];
  patientHistory?: any[];
  isPatientHistoryAvailable: boolean;
  reviewStatus?: ReviewStatus;
  assignedTo?: string;
}

export type ReferenceCategory = 'CARE_EVENT' | 'DEVICE_DRUG' | 'SUBSTITUTION_WATCHLIST' | 'INJURY' | 'COMPLICATION_LIST' | 'OTHER';
export interface ReferenceCodeRecord {
  id:string; code:string; description:string; category:ReferenceCategory; internalBand:'A1'|'A2'|'A3'|'A4'|'A5'|'A6'; scoreContribution:number; active:boolean; rationale:string; source:string; updatedAt:string;
}
export interface ReferenceCodeResponse { items:ReferenceCodeRecord[]; pagination:{page:number;pageSize:number;total:number;totalPages:number}; categories:ReferenceCategory[] }
export interface AnalyticsResponse {
  generatedAt:string;
  summary:{totalCases:number;averageScore:number;highPriority:number;confirmed:number;signalDistribution:{HIGH:number;REVIEW:number;MONITOR:number;NONE:number}};
  componentTotals:{coding:number;timing:number;relatedness:number;intervention:number;history:number};
  providers:Array<{providerId:string;provider:string;cases:number;high:number;averageScore:number}>;
  topDiagnoses:Array<{code:string;cases:number;averageScore:number;maxScore:number}>;
}
