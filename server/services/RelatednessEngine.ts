import { ClaimEntity, ComponentCScore, DiagnosisEntry, HacConfigDTO } from '../contracts/hac.types.js';

/**
 * Real-only behavior:
 * No clinical relationship is invented by the API. Until an approved clinical
 * relationship service or trained AI pathway model is connected, Component C
 * remains UNKNOWN. This preserves the specification rule that "unknown" must
 * not be treated as "unrelated".
 */
export class RelatednessEngine {
  public static evaluate(
    claim: ClaimEntity,
    targetHacDiagnosis: DiagnosisEntry | undefined,
    config: HacConfigDTO
  ): ComponentCScore {
    const maxPoints = config.componentWeights.maxC;
    const primaryDesc = claim.primaryDiagnosis?.description || claim.primaryDiagnosis?.code || 'Admission condition';
    const hacDesc = targetHacDiagnosis?.description || targetHacDiagnosis?.code || 'Suspected complication';

    return {
      component: 'C',
      title: 'Clinical relatedness to the admission indication',
      outcome: 'UNKNOWN',
      outcomeLabel: 'Clinical relationship not yet resolved',
      points: Math.round(maxPoints * 0.5),
      maxPoints,
      pathwaySimilarityPercent: null,
      deviationConfidence: null,
      aiEvidenceAvailable: false,
      aiEvidenceStatus: 'NOT_CONNECTED',
      expectedPathway: [],
      actualPathway: [],
      divergencePoint: '',
      reasoning: `No approved clinical relationship map or trained AI patient-path model is connected for ${primaryDesc} → ${hacDesc}. The system therefore returns UNKNOWN rather than inferring an unrelated relationship.`,
    };
  }
}
