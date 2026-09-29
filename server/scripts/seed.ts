import { SAMPLE_CLAIMS, SAMPLE_DECISIONS, SAMPLE_NOTES } from '../data/seedClaims.js';
import { PersistentJsonStore } from '../services/PersistentJsonStore.js';
import { ReviewWorkflowService } from '../services/ReviewWorkflowService.js';

PersistentJsonStore.write('workflow.json', {
  claims: SAMPLE_CLAIMS,
  notes: SAMPLE_NOTES,
  decisions: SAMPLE_DECISIONS,
});

console.log(`[SEED] Successfully wrote ${SAMPLE_CLAIMS.length} sample claims to workflow.json`);

const res = ReviewWorkflowService.queryReviewQueue({ page: 1, pageSize: 10 });
console.log('[SEED] Review queue items:', res.items.map(i => ({
  id: i.claimId,
  patient: i.patientId,
  score: i.score,
  level: i.signalLevel,
  hacDiagnosis: i.hacDiagnosisCode,
  status: i.reviewStatus,
})));

