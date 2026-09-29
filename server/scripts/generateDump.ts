import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SAMPLE_CLAIMS, SAMPLE_NOTES, SAMPLE_DECISIONS } from '../data/seedClaims.js';
import { HacScoringService } from '../services/HacScoringService.js';
import { AnalyticsService } from '../services/AnalyticsService.js';
import { ReviewWorkflowService } from '../services/ReviewWorkflowService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const investigations: Record<string, any> = {};
SAMPLE_CLAIMS.forEach(claim => {
  const note = SAMPLE_NOTES.find(n => n.claimId === claim.claimId);
  const decision = SAMPLE_DECISIONS.find(d => d.claimId === claim.claimId);
  investigations[claim.claimId] = HacScoringService.calculateInvestigation(claim, note ? 1 : 0, decision?.outcome);
});

const queue = ReviewWorkflowService.queryReviewQueue({ page: 1, pageSize: 50 });
const analytics = AnalyticsService.getSummary();

const clientData = {
  claims: SAMPLE_CLAIMS,
  notes: SAMPLE_NOTES,
  decisions: SAMPLE_DECISIONS,
  queue,
  analytics,
  investigations,
};

const targetPath = path.resolve(__dirname, '../../src/api/sampleData.ts');
const fileContent = `// Pre-generated realistic sample claims, review queue, investigations, and analytics
// Guarantees immediate responsiveness on static hosting without waiting for sleeping backends.

export const SEED_DATA = ${JSON.stringify(clientData, null, 2)} as const;
`;

fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log(`[DUMP] Wrote sample data to ${targetPath}`);
