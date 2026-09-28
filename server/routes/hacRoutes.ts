/**
 * ============================================================================
 * HAC INVESTIGATION & WORKFLOW API ROUTES
 * ============================================================================
 * Production-ready Express router implementing:
 * - GET  /api/hac/claims/:claimId/investigation
 * - GET  /api/hac/claims/:claimId/notes
 * - POST /api/hac/claims/:claimId/notes
 * - POST /api/hac/claims/:claimId/review
 * - GET  /api/hac/review-queue
 * - GET  /api/hac/config
 * - PUT  /api/hac/config
 */

import { Request, Response, Router } from 'express';
import { HacConfigService } from '../config/hacConfig.js';
import {
  CreateReviewerNoteRequestDTO,
  HacSignalLevel,
  HumanReviewDecisionOutcome,
  ReviewQueueFilterDTO,
  ReviewStatus,
  SubmitReviewDecisionRequestDTO,
} from '../contracts/hac.types.js';
import { HacScoringService } from '../services/HacScoringService.js';
import { ReviewWorkflowService } from '../services/ReviewWorkflowService.js';
import { ReferenceCodeService } from '../services/ReferenceCodeService.js';
import { AnalyticsService } from '../services/AnalyticsService.js';

export const hacRouter = Router();

/**
 * ----------------------------------------------------------------------------
 * 1. GET /api/hac/claims/:claimId/investigation
 * Main investigation endpoint returning aggregated score, findings, POA timing,
 * clinical path, intervention modifier, history linkage, data quality, and audit.
 * ----------------------------------------------------------------------------
 */
hacRouter.get('/claims/:claimId/investigation', (req: Request<{ claimId: string }>, res: Response) => {
  try {
    const { claimId } = req.params;

    if (!claimId || claimId.trim() === '') {
      res.status(400).json({
        error: 'BAD_REQUEST',
        message: 'A non-empty claimId parameter is required.',
      });
      return;
    }

    const claim = ReviewWorkflowService.getClaim(claimId);
    if (!claim) {
      res.status(404).json({
        error: 'CLAIM_NOT_FOUND',
        message: `Claim with ID '${claimId}' was not found in the investigation registry.`,
      });
      return;
    }

    const notes = ReviewWorkflowService.getNotes(claimId);
    const lastDecision = ReviewWorkflowService.getLastDecision(claimId);

    // Backend-driven calculation - single source of truth
    const payload = HacScoringService.calculateInvestigation(
      claim,
      notes.length,
      lastDecision?.outcome
    );

    res.status(200).json(payload);
  } catch (error: any) {
    console.error(`[HAC API Error] Investigation calculation failed:`, error);
    res.status(500).json({
      error: 'CALCULATION_ERROR',
      message: 'An internal error occurred during HAC signal investigation scoring.',
      details: error?.message || 'Unknown error',
    });
  }
});

/**
 * ----------------------------------------------------------------------------
 * 2. GET /api/hac/claims/:claimId/notes
 * Retrieves all clinical reviewer notes for a claim.
 * ----------------------------------------------------------------------------
 */
hacRouter.get('/claims/:claimId/notes', (req: Request<{ claimId: string }>, res: Response) => {
  try {
    const { claimId } = req.params;
    const claim = ReviewWorkflowService.getClaim(claimId);

    if (!claim) {
      res.status(404).json({
        error: 'CLAIM_NOT_FOUND',
        message: `Claim with ID '${claimId}' does not exist.`,
      });
      return;
    }

    const notes = ReviewWorkflowService.getNotes(claimId);
    res.status(200).json({
      claimId,
      totalNotes: notes.length,
      notes,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: error.message });
  }
});

/**
 * ----------------------------------------------------------------------------
 * 3. POST /api/hac/claims/:claimId/notes
 * Adds a timestamped clinical reviewer note to a claim.
 * ----------------------------------------------------------------------------
 */
hacRouter.post('/claims/:claimId/notes', (req: Request<{ claimId: string }>, res: Response) => {
  try {
    const { claimId } = req.params;
    const { author, authorRole, content } = req.body as CreateReviewerNoteRequestDTO;

    if (!content || content.trim() === '') {
      res.status(400).json({
        error: 'INVALID_NOTE_CONTENT',
        message: 'The clinical note content cannot be empty.',
      });
      return;
    }

    const note = ReviewWorkflowService.addNote(claimId, {
      author: author as string,
      authorRole: authorRole as string,
      content: content.trim(),
    });

    res.status(201).json(note);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: 'CLAIM_NOT_FOUND', message: error.message });
      return;
    }
    res.status(500).json({ error: 'INTERNAL_ERROR', message: error.message });
  }
});

/**
 * ----------------------------------------------------------------------------
 * 4. POST /api/hac/claims/:claimId/review
 * Records a human reviewer decision on the claim.
 * Validates outcome against strict enum.
 * ----------------------------------------------------------------------------
 */
hacRouter.post('/claims/:claimId/review', (req: Request<{ claimId: string }>, res: Response) => {
  try {
    const { claimId } = req.params;
    const { outcome, rationale, reviewerId, reviewerName } = req.body as SubmitReviewDecisionRequestDTO;

    const validOutcomes: HumanReviewDecisionOutcome[] = [
      'CONFIRM_CONCERN',
      'NO_CONCERN',
      'NEED_MORE_INFORMATION',
      'EXPECTED_PROGRESSION',
      'ROUTE_OTHER_PROVIDER',
      'MONITOR',
      'ESCALATE',
    ];

    if (!outcome || !validOutcomes.includes(outcome)) {
      res.status(400).json({
        error: 'INVALID_DECISION_OUTCOME',
        message: `Outcome must be one of: ${validOutcomes.join(', ')}`,
      });
      return;
    }

    if (!rationale || rationale.trim() === '') {
      res.status(400).json({
        error: 'MISSING_RATIONALE',
        message: 'A clinical rationale must be documented when submitting a review decision.',
      });
      return;
    }

    const decision = ReviewWorkflowService.submitDecision(claimId, {
      outcome,
      rationale: rationale.trim(),
      reviewerId: reviewerId as string,
      reviewerName: reviewerName as string,
    });

    res.status(200).json({
      message: 'Review decision successfully recorded.',
      decision,
    });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: 'CLAIM_NOT_FOUND', message: error.message });
      return;
    }
    res.status(500).json({ error: 'INTERNAL_ERROR', message: error.message });
  }
});

/**
 * ----------------------------------------------------------------------------
 * 5. GET /api/hac/review-queue
 * Server-side paginated review queue with filtering and dynamic scoring.
 * ----------------------------------------------------------------------------
 */
hacRouter.get('/review-queue', (req: Request, res: Response) => {
  try {
    const filter: ReviewQueueFilterDTO = {
      search: req.query.search as string | undefined,
      signalLevel: req.query.signalLevel as HacSignalLevel | undefined,
      providerId: req.query.providerId as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      assignedTo: req.query.assignedTo as string | undefined,
      reviewStatus: req.query.reviewStatus as ReviewStatus | undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10,
      sortBy: (req.query.sortBy as any) || 'score',
      sortDirection: (req.query.sortDirection as any) || 'desc',
    };

    const queueResponse = ReviewWorkflowService.queryReviewQueue(filter);
    res.status(200).json(queueResponse);
  } catch (error: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: error.message });
  }
});

/**
 * ----------------------------------------------------------------------------
 * 6. GET /api/hac/config
 * Retrieves active HAC scoring configuration and audit metadata.
 * ----------------------------------------------------------------------------
 */
hacRouter.get('/config', (_req: Request, res: Response) => {
  const config = HacConfigService.getConfig();
  res.status(200).json(config);
});

/**
 * ----------------------------------------------------------------------------
 * 7. PUT /api/hac/config
 * Dynamically updates configuration thresholds, weights, or suppressors.
 * ----------------------------------------------------------------------------
 */
hacRouter.put('/config', (req: Request, res: Response) => {
  try {
    const updated = HacConfigService.updateConfig(req.body);
    res.status(200).json({
      message: 'Configuration successfully updated.',
      config: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      error: 'CONFIG_UPDATE_FAILED',
      message: error.message,
    });
  }
});

/**
 * ----------------------------------------------------------------------------
 * 8. POST /api/hac/claims & POST /api/hac/claims/upload
 * Ingests single or batch claims, validates clinical schema, and adds them to
 * the active review store with dynamic scoring calculation.
 * ----------------------------------------------------------------------------
 */
const handleClaimUpload = (req: Request, res: Response) => {
  try {
    const body = req.body;
    const itemsToIngest = Array.isArray(body) ? body : Array.isArray(body?.claims) ? body.claims : [body];
    if (!itemsToIngest || itemsToIngest.length === 0 || !itemsToIngest[0]) {
      res.status(400).json({ error: 'EMPTY_PAYLOAD', message: 'No claim data provided to ingest.' });
      return;
    }
    const createdClaims = ReviewWorkflowService.addClaims(itemsToIngest);
    const investigation = createdClaims.length === 1 ? HacScoringService.calculateInvestigation(createdClaims[0]) : undefined;
    res.status(201).json({
      message: `Successfully ingested ${createdClaims.length} claim(s).`,
      count: createdClaims.length,
      claims: createdClaims,
      investigationSummary: investigation ? {
        claimId: createdClaims[0].claimId,
        score: investigation.signalResult.score,
        level: investigation.signalResult.level,
      } : undefined,
    });
  } catch (error: any) {
    console.error('[HAC Ingestion Error]', error);
    res.status(400).json({ error: 'INGESTION_FAILED', message: error?.message || 'Unable to ingest claim.' });
  }
};

hacRouter.post('/claims', handleClaimUpload);
hacRouter.post('/claims/upload', handleClaimUpload);

/**
 * ----------------------------------------------------------------------------
 * 9. GET /api/hac/claims/:claimId
 * Returns the editable/raw claim payload used by the claim editor UI.
 * ----------------------------------------------------------------------------
 */
hacRouter.get('/claims/:claimId', (req: Request<{ claimId: string }>, res: Response) => {
  const claim = ReviewWorkflowService.getClaim(req.params.claimId);
  if (!claim) {
    res.status(404).json({ error: 'CLAIM_NOT_FOUND', message: `Claim ${req.params.claimId} not found.` });
    return;
  }
  res.status(200).json(claim);
});

/**
 * ----------------------------------------------------------------------------
 * 10. PUT /api/hac/claims/:claimId
 * Updates an existing claim and recalculates its investigation result.
 * ----------------------------------------------------------------------------
 */
hacRouter.put('/claims/:claimId', (req: Request<{ claimId: string }>, res: Response) => {
  try {
    const claim = ReviewWorkflowService.updateClaim(req.params.claimId, req.body || {});
    const investigation = HacScoringService.calculateInvestigation(claim);
    res.status(200).json({
      message: 'Claim updated successfully.',
      claim,
      investigationSummary: {
        claimId: claim.claimId,
        score: investigation.signalResult.score,
        level: investigation.signalResult.level,
      },
    });
  } catch (error: any) {
    const notFound = String(error?.message || '').includes('not found');
    res.status(notFound ? 404 : 400).json({
      error: notFound ? 'CLAIM_NOT_FOUND' : 'CLAIM_UPDATE_FAILED',
      message: error?.message || 'Unable to update claim.',
    });
  }
});

/**
 * ----------------------------------------------------------------------------
 * 11. DELETE /api/hac/claims/:claimId
 * Deletes a claim from the demo investigation registry.
 * ----------------------------------------------------------------------------
 */
hacRouter.delete('/claims/:claimId', (req: Request<{ claimId: string }>, res: Response) => {
  try {
    ReviewWorkflowService.deleteClaim(req.params.claimId);
    res.status(200).json({ message: 'Claim deleted successfully.', claimId: req.params.claimId });
  } catch (error: any) {
    res.status(404).json({ error: 'CLAIM_NOT_FOUND', message: error?.message || 'Claim not found.' });
  }
});

/** Live analytics calculated from the active backend claim store. */
hacRouter.get('/analytics', (_req: Request, res: Response) => {
  try { res.status(200).json(AnalyticsService.getSummary()); }
  catch (error:any) { res.status(500).json({ error:'ANALYTICS_FAILED', message:error?.message || 'Unable to calculate analytics.' }); }
});

/** Backend-managed reference catalog used by the Code Reference screen. */
hacRouter.get('/reference/codes', (req: Request, res: Response) => {
  try {
    res.status(200).json(ReferenceCodeService.list({
      search: req.query.search as string | undefined,
      category: req.query.category as string | undefined,
      active: req.query.active as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20,
    }));
  } catch (error:any) { res.status(500).json({ error:'REFERENCE_READ_FAILED', message:error?.message || 'Unable to load reference catalog.' }); }
});

hacRouter.post('/reference/codes', (req: Request, res: Response) => {
  try { res.status(201).json({ message:'Reference code created successfully.', item:ReferenceCodeService.create(req.body || {}) }); }
  catch (error:any) { res.status(400).json({ error:'REFERENCE_CREATE_FAILED', message:error?.message || 'Unable to create reference code.' }); }
});

hacRouter.post('/reference/codes/import', (req: Request, res: Response) => {
  try { const rows = Array.isArray(req.body) ? req.body : req.body?.items; const items = ReferenceCodeService.createMany(rows || []); res.status(201).json({ message:`Imported ${items.length} reference record(s).`, items }); }
  catch (error:any) { res.status(400).json({ error:'REFERENCE_IMPORT_FAILED', message:error?.message || 'Unable to import reference codes.' }); }
});

hacRouter.put('/reference/codes/:id', (req: Request<{id:string}>, res: Response) => {
  try { res.status(200).json({ message:'Reference code updated successfully.', item:ReferenceCodeService.update(req.params.id, req.body || {}) }); }
  catch (error:any) { res.status(400).json({ error:'REFERENCE_UPDATE_FAILED', message:error?.message || 'Unable to update reference code.' }); }
});

hacRouter.delete('/reference/codes/:id', (req: Request<{id:string}>, res: Response) => {
  try { const item=ReferenceCodeService.remove(req.params.id); res.status(200).json({ message:'Reference code deleted successfully.', item }); }
  catch (error:any) { res.status(404).json({ error:'REFERENCE_NOT_FOUND', message:error?.message || 'Reference code not found.' }); }
});

