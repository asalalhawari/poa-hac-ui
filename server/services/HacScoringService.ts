/**
 * ============================================================================
 * HAC SCORING SERVICE (MASTER ENGINE)
 * ============================================================================
 * Central single-source-of-truth orchestrator for HAC signal investigation.
 * Aggregates all components (A-E), evaluates suppressors, calculates overall
 * score, classifies signal level, generates user-friendly finding cards,
 * and attaches cryptographic audit metadata.
 *
 * Fundamental Rule: Action is ALWAYS 'HUMAN_REVIEW'. No automated denials.
 */

import { HacConfigService } from '../config/hacConfig.js';
import {
  AppliedSuppressor,
  ClaimEntity,
  FindingCardDTO,
  HacAction,
  HacInvestigationPayloadDTO,
  HacSignalLevel,
  TechnicalComponentRowDTO,
} from '../contracts/hac.types.js';
import { AuditService } from './AuditService.js';
import { ComponentAService } from './ComponentAService.js';
import { DataQualityValidator } from './DataQualityValidator.js';
import { InterventionClassifier } from './InterventionClassifier.js';
import { ProviderHistoryService } from './ProviderHistoryService.js';
import { RelatednessEngine } from './RelatednessEngine.js';
import { TimelineAggregator } from './TimelineAggregator.js';
import { TimingPoaService } from './TimingPoaService.js';

export class HacScoringService {
  /**
   * Generates the complete investigation payload for a claim.
   */
  public static calculateInvestigation(
    claim: ClaimEntity,
    notesCount = 0,
    lastDecision?: any
  ): HacInvestigationPayloadDTO {
    const config = HacConfigService.getConfig();

    // 1. Data Quality Validation
    const dataQuality = DataQualityValidator.validate(claim);

    // Identify target HAC diagnosis (or fallback to primary)
    const targetHacDiagnosis =
      claim.diagnoses.find((d) => d.isSuspectedHacCondition) ||
      claim.diagnoses[1] ||
      claim.primaryDiagnosis;

    // 2. Component Evaluations (A through E)
    const componentA = ComponentAService.evaluate(targetHacDiagnosis, config);
    const componentB = TimingPoaService.evaluate(claim.admissionDateTime, targetHacDiagnosis, config, claim.encounterType || 'INPATIENT');
    const componentC = RelatednessEngine.evaluate(claim, targetHacDiagnosis, config);
    if (componentC.outcome === 'UNKNOWN') {
      dataQuality.flags.push({
        code: 'DQ_INFO_UNMAPPED_CLINICAL_RELATIONSHIP',
        severity: 'INFO',
        field: 'clinicalRelatedness',
        message: 'The admission-to-new-diagnosis relationship is currently unmapped/unknown.',
        mitigation: 'Route the pair to Clinical + AI relationship review; do not treat unknown as unrelated.',
      });
      if (dataQuality.overallStatus === 'COMPLETE') dataQuality.overallStatus = 'PARTIAL';
    }
    const componentD = InterventionClassifier.evaluate(claim, config);
    const componentE = ProviderHistoryService.evaluate(claim, config);

    // 3. Raw Score Summation
    const rawTotal =
      componentA.points +
      componentB.points +
      componentC.points +
      componentD.points +
      componentE.points;

    // 4. Suppressors Evaluation
    const appliedSuppressors: AppliedSuppressor[] = [];
    let finalScore = rawTotal;

    // Documented suppressor: recognized progression caps the entire score at 30.
    if (config.suppressors.enableRecognizedProgressionCap && componentC.outcome === 'RECOGNIZED_PROGRESSION') {
      const scoreBefore = finalScore;
      finalScore = Math.min(finalScore, config.suppressors.recognizedProgressionCap);
      if (finalScore < scoreBefore) appliedSuppressors.push({
        suppressorId: 'SUPPRESSOR_RECOGNIZED_PROGRESSION',
        name: 'Recognized progression ceiling',
        triggered: true,
        scoreBeforeSuppression: scoreBefore,
        scoreAfterSuppression: finalScore,
        reasoning: `Recognized progression of the admitting illness caps the total signal at ${config.suppressors.recognizedProgressionCap}.`,
      });
    }

    // Documented routing suppressor: a prior causing procedure at another provider caps score at 15.
    if (config.suppressors.enableDifferentProviderCap && componentE.outcome === 'DIFFERENT_PROVIDER') {
      const scoreBefore = finalScore;
      finalScore = Math.min(finalScore, config.suppressors.differentProviderCap);
      if (finalScore < scoreBefore) appliedSuppressors.push({
        suppressorId: 'SUPPRESSOR_DIFFERENT_PROVIDER',
        name: 'Different-provider routing ceiling',
        triggered: true,
        scoreBeforeSuppression: scoreBefore,
        scoreAfterSuppression: finalScore,
        reasoning: `The prior related procedure belongs to a different provider; route rather than attribute. Score capped at ${config.suppressors.differentProviderCap}.`,
      });
    }

    // Optional future extensions remain configurable and are disabled by default.
    if (config.suppressors.enablePalliativeCareExclusion && claim.isPalliativeCareDocumented) {
      const scoreBefore = finalScore;
      finalScore = 0;
      appliedSuppressors.push({ suppressorId:'SUPPRESSOR_PALLIATIVE_CARE', name:'Palliative care extension', triggered:true, scoreBeforeSuppression:scoreBefore, scoreAfterSuppression:finalScore, reasoning:'Optional non-spec extension enabled by configuration.' });
    }
    if (config.suppressors.enablePlannedStagedExclusion && claim.isPlannedStagedProcedure) {
      const scoreBefore = finalScore;
      finalScore = Math.max(0, finalScore - componentD.points);
      appliedSuppressors.push({ suppressorId:'SUPPRESSOR_STAGED_PROCEDURE', name:'Planned staged procedure extension', triggered:true, scoreBeforeSuppression:scoreBefore, scoreAfterSuppression:finalScore, reasoning:'Optional non-spec extension enabled by configuration.' });
    }

    // Clamp score within 0 to 100
    finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

    // 5. Signal Level Classification
    let level: HacSignalLevel = 'NONE';
    if (finalScore >= config.signalLevelCutoffs.high) {
      level = 'HIGH';
    } else if (finalScore >= config.signalLevelCutoffs.review) {
      level = 'REVIEW';
    } else if (finalScore >= config.signalLevelCutoffs.monitor) {
      level = 'MONITOR';
    }

    const action: HacAction = 'HUMAN_REVIEW';

    // 6. User-friendly summary copy
    let summaryHeadline = 'High likelihood of an in-stay complication pattern';
    let summaryDescription = 'The signal is driven mainly by a new condition appearing late in the stay and an unplanned return to theatre.';

    if (level === 'REVIEW') {
      summaryHeadline = 'Moderate complication signal requiring clinical review';
      summaryDescription = 'Timing or procedural escalation suggests an in-stay event warranting review.';
    } else if (level === 'MONITOR') {
      summaryHeadline = 'Low-level signal registered for surveillance';
      summaryDescription = 'Clinical presentation exhibits minor complication indicators; routed for baseline monitoring.';
    } else if (level === 'NONE') {
      summaryHeadline = 'No significant hospital-acquired complication signal';
      summaryDescription = 'Events are consistent with admission indication or known clinical progression.';
    }

    // 7. UI Findings Cards Generation
    const findingsCards = this.buildFindingsCards(componentA, componentB, componentC, componentD, componentE);

    // 8. Technical Rows for Audit View
    const technicalRows: TechnicalComponentRowDTO[] = [
      {
        component: 'A',
        label: 'Diagnosis pattern',
        bandAndDescription: `${componentA.band} · ${componentA.bandLabel}`,
        scoreDisplay: `${componentA.points} / ${componentA.maxPoints}`,
        points: componentA.points,
        maxPoints: componentA.maxPoints,
      },
      {
        component: 'B',
        label: 'Timing / inferred POA',
        bandAndDescription: `${componentB.band} · ${componentB.bandLabel}`,
        scoreDisplay: `${componentB.points} / ${componentB.maxPoints}`,
        points: componentB.points,
        maxPoints: componentB.maxPoints,
      },
      {
        component: 'C',
        label: 'Clinical relatedness',
        bandAndDescription: `${componentC.outcome} · ${componentC.outcomeLabel}`,
        scoreDisplay: `${componentC.points} / ${componentC.maxPoints}`,
        points: componentC.points,
        maxPoints: componentC.maxPoints,
      },
      {
        component: 'D',
        label: 'Triggered intervention',
        bandAndDescription: `${componentD.category} · ${componentD.categoryLabel}`,
        scoreDisplay: `${componentD.points} / ${componentD.maxPoints}`,
        points: componentD.points,
        maxPoints: componentD.maxPoints,
      },
      {
        component: 'E',
        label: 'Provider linkage',
        bandAndDescription: `${componentE.outcome} · ${componentE.outcomeLabel}`,
        scoreDisplay: `${componentE.points} / ${componentE.maxPoints}`,
        points: componentE.points,
        maxPoints: componentE.maxPoints,
      },
    ];

    // 9. Timeline Aggregation
    const timeline = TimelineAggregator.buildTimeline(claim);

    // 10. Audit Metadata Generation
    const audit = AuditService.generateAuditMetadata(
      claim.claimId,
      {
        A: componentA.points,
        B: componentB.points,
        C: componentC.points,
        D: componentD.points,
        E: componentE.points,
      },
      finalScore,
      config
    );

    return {
      claimId: claim.claimId,
      patientId: claim.patientId,
      patientAge: claim.patientAge,
      patientGender: claim.patientGender,
      provider: {
        id: claim.providerId,
        facilityCode: claim.providerFacilityCode,
        displayName: claim.providerDisplayName,
      },
      stayTimestamps: {
        admissionDateTime: claim.admissionDateTime,
        dischargeDateTime: claim.dischargeDateTime,
        lengthOfStayDays: claim.lengthOfStayDays,
      },
      signalResult: {
        score: finalScore,
        level,
        action,
        summaryHeadline,
        summaryDescription,
      },
      findingsCards,
      technicalBreakdown: {
        rows: technicalRows,
        componentA,
        componentB,
        componentC,
        componentD,
        componentE,
      },
      timeline,
      clinicalPath: {
        expected: componentC.expectedPathway,
        actual: componentC.actualPathway,
        divergencePoint: componentC.divergencePoint,
        similarityPercent: componentC.pathwaySimilarityPercent,
        deviationConfidence: componentC.deviationConfidence,
        aiEvidenceAvailable: componentC.aiEvidenceAvailable,
        aiEvidenceStatus: componentC.aiEvidenceStatus,
      },
      dataQuality,
      suppressors: {
        rawScore: rawTotal,
        finalScore,
        applied: appliedSuppressors,
        isScoreCapped: componentD.isCeilingApplied || appliedSuppressors.length > 0,
      },
      workflow: {
        reviewStatus: claim.reviewStatus,
        assignedTo: claim.assignedTo,
        notesCount,
        lastDecision,
      },
      audit,
    };
  }

  private static buildFindingsCards(
    compA: any,
    compB: any,
    compC: any,
    compD: any,
    compE: any
  ): FindingCardDTO[] {
    const cards: FindingCardDTO[] = [];

    // Card 1: Timing
    cards.push({
      key: 'timing',
      title: 'New condition appeared after admission',
      headline:
        compB.elapsedHoursFromAdmission !== null
          ? `First detected ${compB.elapsedHoursFromAdmission} hours after admission`
          : 'Timing inferred from claim service lines',
      summary: compB.reasoning,
      level: compB.points >= 15 ? 'Strong evidence' : compB.points > 0 ? 'Moderate evidence' : 'No in-stay timing signal',
      tone: compB.points >= 15 ? 'high' : compB.points > 0 ? 'medium' : 'neutral',
      points: compB.points,
      maxPoints: compB.maxPoints,
    });

    // Card 2: Path
    cards.push({
      key: 'path',
      title: 'Patient path changed unexpectedly',
      headline:
        compC.outcome === 'UNRELATED'
          ? 'The new condition does not fit the expected recovery path'
          : compC.outcome === 'RECOGNIZED_PROGRESSION'
          ? 'Matches expected illness progression'
          : 'Clinical pathway divergence detected',
      summary: compC.reasoning,
      level: compC.points >= 15 ? 'Strong evidence' : compC.points > 0 ? 'Moderate evidence' : 'Expected progression',
      tone: compC.points >= 15 ? 'high' : compC.points > 0 ? 'medium' : 'positive',
      points: compC.points,
      maxPoints: compC.maxPoints,
    });

    // Card 3: Intervention
    cards.push({
      key: 'intervention',
      title: 'Unexpected intervention was required',
      headline: compD.triggerProcedureDescription
        ? `Patient required: ${compD.triggerProcedureDescription}`
        : compD.categoryLabel,
      summary: compD.reasoning,
      level: compD.points >= 20 ? 'Very strong evidence' : compD.points > 0 ? 'Secondary intervention' : 'No acute escalation',
      tone: compD.points >= 20 ? 'critical' : compD.points > 0 ? 'medium' : 'neutral',
      points: compD.points,
      maxPoints: compD.maxPoints,
    });

    // Card 4: Coding Transparency
    cards.push({
      key: 'coding',
      title: 'Diagnosis wording supports a complication pattern',
      headline: `${compA.code} - ${compA.bandLabel}`,
      summary: compA.reasoning,
      level: compA.points >= 15 ? 'Direct admission' : compA.points > 0 ? 'Supporting evidence' : 'Standard diagnosis',
      tone: compA.points >= 15 ? 'high' : compA.points > 0 ? 'medium' : 'neutral',
      points: compA.points,
      maxPoints: compA.maxPoints,
    });

    // Card 5: History Linkage
    cards.push({
      key: 'history',
      title: 'Previous provider history checked',
      headline: compE.linkedPriorProcedure
        ? `Linked prior procedure: ${compE.linkedPriorProcedure}`
        : compE.outcomeLabel,
      summary: compE.reasoning,
      level: compE.points > 0 ? 'Linked readmission' : compE.historyAvailable ? 'No added evidence' : 'History unavailable',
      tone: compE.points > 0 ? 'high' : 'neutral',
      points: compE.points,
      maxPoints: compE.maxPoints,
    });

    return cards;
  }
}
