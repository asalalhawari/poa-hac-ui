import test from 'node:test';
import assert from 'node:assert/strict';
import { HacScoringService } from '../services/HacScoringService.js';
import type { ClaimEntity } from '../contracts/hac.types.js';

const claim: ClaimEntity = {
  claimId:'TEST-REAL-001', patientId:'P-1', providerId:'PRV-1', providerFacilityCode:'FAC-1', providerDisplayName:'Test Provider',
  admissionDateTime:'2026-01-01T00:00:00.000Z', dischargeDateTime:'2026-01-04T00:00:00.000Z', lengthOfStayDays:3,
  primaryDiagnosis:{code:'J18.9',description:'Pneumonia',isPrimaryAdmissionDiagnosis:true,isSuspectedHacCondition:false,firstObservedDateTime:'2026-01-01T00:00:00.000Z'},
  diagnoses:[
    {code:'J18.9',description:'Pneumonia',isPrimaryAdmissionDiagnosis:true,isSuspectedHacCondition:false,firstObservedDateTime:'2026-01-01T00:00:00.000Z'},
    {code:'S72.001A',description:'Femur fracture',isPrimaryAdmissionDiagnosis:false,isSuspectedHacCondition:true,firstObservedDateTime:'2026-01-03T03:00:00.000Z'}
  ], procedures:[], isPatientHistoryAvailable:false, patientHistory:[], reviewStatus:'NEW', encounterType:'INPATIENT'
};

test('scoring produces an auditable result without inventing AI evidence',()=>{
  const result=HacScoringService.calculateInvestigation(claim);
  assert.equal(result.clinicalPath.aiEvidenceAvailable,false);
  assert.equal(result.clinicalPath.aiEvidenceStatus,'NOT_CONNECTED');
  assert.equal(result.technicalBreakdown.componentC.outcome,'UNKNOWN');
});
