// Pre-generated realistic sample claims, review queue, investigations, and analytics
// Guarantees immediate responsiveness on static hosting without waiting for sleeping backends.

export const SEED_DATA = {
  "claims": [
    {
      "claimId": "CLM-2026-0841",
      "patientId": "PAT-9401",
      "patientAge": 58,
      "patientGender": "F",
      "providerId": "PRV-MUSCAT-01",
      "providerFacilityCode": "FAC-MCT-001",
      "providerDisplayName": "Muscat General Hospital",
      "admissionDateTime": "2026-03-10T08:00:00.000Z",
      "dischargeDateTime": "2026-03-18T14:00:00.000Z",
      "lengthOfStayDays": 8,
      "encounterType": "INPATIENT",
      "reviewStatus": "NEW",
      "primaryDiagnosis": {
        "code": "K80.00",
        "description": "Calculus of gallbladder with acute cholecystitis without obstruction",
        "isPrimaryAdmissionDiagnosis": true,
        "isSuspectedHacCondition": false,
        "firstObservedDateTime": "2026-03-10T08:00:00.000Z"
      },
      "diagnoses": [
        {
          "code": "K80.00",
          "description": "Calculus of gallbladder with acute cholecystitis without obstruction",
          "isPrimaryAdmissionDiagnosis": true,
          "isSuspectedHacCondition": false,
          "firstObservedDateTime": "2026-03-10T08:00:00.000Z"
        },
        {
          "code": "T81.4XXA",
          "description": "Infection following a procedure, deep surgical site infection, initial encounter",
          "isPrimaryAdmissionDiagnosis": false,
          "isSuspectedHacCondition": true,
          "firstObservedDateTime": "2026-03-13T11:00:00.000Z"
        },
        {
          "code": "A41.9",
          "description": "Sepsis, unspecified organism",
          "isPrimaryAdmissionDiagnosis": false,
          "isSuspectedHacCondition": false,
          "firstObservedDateTime": "2026-03-13T16:00:00.000Z"
        }
      ],
      "procedures": [
        {
          "code": "47562",
          "description": "Laparoscopic cholecystectomy",
          "performedDateTime": "2026-03-10T11:30:00.000Z",
          "isPlannedOnAdmission": true
        },
        {
          "code": "49002",
          "description": "Reopening of recent laparotomy with incision and drainage / surgical debridement",
          "performedDateTime": "2026-03-14T07:15:00.000Z",
          "isPlannedOnAdmission": false,
          "isReturnToTheatre": true,
          "requiresPreApproval": true,
          "preApprovalObtained": false
        },
        {
          "code": "99.18",
          "description": "Injection or infusion of broad-spectrum antibiotic rescue agent (Vancomycin)",
          "performedDateTime": "2026-03-13T12:00:00.000Z",
          "isPlannedOnAdmission": false,
          "isRescueDrug": true
        }
      ],
      "isPatientHistoryAvailable": true,
      "patientHistory": [
        {
          "id": "HIST-9401-01",
          "claimId": "CLM-2026-0412",
          "providerId": "PRV-MUSCAT-01",
          "facilityCode": "FAC-MCT-001",
          "serviceDateTime": "2026-02-20T10:00:00.000Z",
          "procedureCode": "47600",
          "procedureDescription": "Exploration of common bile duct",
          "isRelatedToCurrentCondition": true,
          "daysPriorToAdmission": 18
        }
      ]
    },
    {
      "claimId": "CLM-2026-1123",
      "patientId": "PAT-5529",
      "patientAge": 69,
      "patientGender": "M",
      "providerId": "PRV-SALALAH-04",
      "providerFacilityCode": "FAC-SLL-004",
      "providerDisplayName": "Salalah Care Center",
      "admissionDateTime": "2026-03-14T11:00:00.000Z",
      "dischargeDateTime": "2026-03-19T10:00:00.000Z",
      "lengthOfStayDays": 5,
      "encounterType": "INPATIENT",
      "reviewStatus": "IN_REVIEW",
      "primaryDiagnosis": {
        "code": "I50.9",
        "description": "Heart failure, unspecified decompensated",
        "isPrimaryAdmissionDiagnosis": true,
        "isSuspectedHacCondition": false,
        "firstObservedDateTime": "2026-03-14T11:00:00.000Z"
      },
      "diagnoses": [
        {
          "code": "I50.9",
          "description": "Heart failure, unspecified decompensated",
          "isPrimaryAdmissionDiagnosis": true,
          "isSuspectedHacCondition": false,
          "firstObservedDateTime": "2026-03-14T11:00:00.000Z"
        },
        {
          "code": "T83.511A",
          "description": "Infection and inflammatory reaction due to indwelling urinary catheter, initial encounter",
          "isPrimaryAdmissionDiagnosis": false,
          "isSuspectedHacCondition": true,
          "firstObservedDateTime": "2026-03-16T15:30:00.000Z"
        },
        {
          "code": "N39.0",
          "description": "Urinary tract infection, site not specified",
          "isPrimaryAdmissionDiagnosis": false,
          "isSuspectedHacCondition": false,
          "firstObservedDateTime": "2026-03-16T15:30:00.000Z"
        }
      ],
      "procedures": [
        {
          "code": "57.94",
          "description": "Insertion of indwelling urinary catheter",
          "performedDateTime": "2026-03-14T13:00:00.000Z",
          "isPlannedOnAdmission": true
        },
        {
          "code": "99.21",
          "description": "Infusion of targeted rescue antibiotic therapy (Ceftriaxone)",
          "performedDateTime": "2026-03-16T17:00:00.000Z",
          "isPlannedOnAdmission": false,
          "isRescueDrug": true,
          "isRescueIntervention": true
        }
      ],
      "isPatientHistoryAvailable": true,
      "patientHistory": []
    },
    {
      "claimId": "CLM-2026-2049",
      "patientId": "PAT-3180",
      "patientAge": 76,
      "patientGender": "F",
      "providerId": "PRV-NIZWA-02",
      "providerFacilityCode": "FAC-NZW-002",
      "providerDisplayName": "Nizwa Regional Hospital",
      "admissionDateTime": "2026-03-18T06:00:00.000Z",
      "dischargeDateTime": "2026-03-24T18:00:00.000Z",
      "lengthOfStayDays": 6,
      "encounterType": "INPATIENT",
      "reviewStatus": "MONITORING",
      "primaryDiagnosis": {
        "code": "I63.9",
        "description": "Cerebral infarction, unspecified (Acute ischemic stroke)",
        "isPrimaryAdmissionDiagnosis": true,
        "isSuspectedHacCondition": false,
        "firstObservedDateTime": "2026-03-18T06:00:00.000Z"
      },
      "diagnoses": [
        {
          "code": "I63.9",
          "description": "Cerebral infarction, unspecified (Acute ischemic stroke)",
          "isPrimaryAdmissionDiagnosis": true,
          "isSuspectedHacCondition": false,
          "firstObservedDateTime": "2026-03-18T06:00:00.000Z"
        },
        {
          "code": "L89.152",
          "description": "Pressure ulcer of sacral region, stage 2",
          "isPrimaryAdmissionDiagnosis": false,
          "isSuspectedHacCondition": true,
          "firstObservedDateTime": "2026-03-21T09:00:00.000Z"
        }
      ],
      "procedures": [
        {
          "code": "86.28",
          "description": "Nonexcisional debridement and specialized wound barrier dressing",
          "performedDateTime": "2026-03-21T11:00:00.000Z",
          "isPlannedOnAdmission": false
        }
      ],
      "isPatientHistoryAvailable": false,
      "patientHistory": []
    },
    {
      "claimId": "CLM-2026-3392",
      "patientId": "PAT-7215",
      "patientAge": 71,
      "patientGender": "M",
      "providerId": "PRV-SOHAR-01",
      "providerFacilityCode": "FAC-SHR-001",
      "providerDisplayName": "Sohar Medical Complex",
      "admissionDateTime": "2026-03-20T14:00:00.000Z",
      "dischargeDateTime": "2026-03-23T11:00:00.000Z",
      "lengthOfStayDays": 3,
      "encounterType": "INPATIENT",
      "reviewStatus": "RESOLVED",
      "primaryDiagnosis": {
        "code": "S72.001A",
        "description": "Fracture of unspecified part of neck of right femur, initial encounter",
        "isPrimaryAdmissionDiagnosis": true,
        "isSuspectedHacCondition": false,
        "firstObservedDateTime": "2026-03-20T14:00:00.000Z"
      },
      "diagnoses": [
        {
          "code": "S72.001A",
          "description": "Fracture of unspecified part of neck of right femur, initial encounter",
          "isPrimaryAdmissionDiagnosis": true,
          "isSuspectedHacCondition": false,
          "firstObservedDateTime": "2026-03-20T14:00:00.000Z"
        },
        {
          "code": "L89.311",
          "description": "Pressure ulcer of right buttock, stage 1 (Present on admission)",
          "isPrimaryAdmissionDiagnosis": false,
          "isSuspectedHacCondition": true,
          "firstObservedDateTime": "2026-03-20T14:00:00.000Z"
        }
      ],
      "procedures": [
        {
          "code": "79.35",
          "description": "Open reduction of fracture with internal fixation, femur",
          "performedDateTime": "2026-03-21T09:00:00.000Z",
          "isPlannedOnAdmission": true
        }
      ],
      "isPatientHistoryAvailable": true,
      "patientHistory": []
    },
    {
      "claimId": "CLM-2026-4401",
      "patientId": "PAT-8812",
      "patientAge": 64,
      "patientGender": "F",
      "providerId": "PRV-MUSCAT-02",
      "providerFacilityCode": "FAC-MCT-002",
      "providerDisplayName": "Sultan Qaboos Medical City",
      "admissionDateTime": "2026-03-15T09:00:00.000Z",
      "dischargeDateTime": "2026-03-22T12:00:00.000Z",
      "lengthOfStayDays": 7,
      "encounterType": "INPATIENT",
      "reviewStatus": "IN_REVIEW",
      "primaryDiagnosis": {
        "code": "M16.11",
        "description": "Unilateral primary osteoarthritis, right hip",
        "isPrimaryAdmissionDiagnosis": true,
        "isSuspectedHacCondition": false,
        "firstObservedDateTime": "2026-03-15T09:00:00.000Z"
      },
      "diagnoses": [
        {
          "code": "M16.11",
          "description": "Unilateral primary osteoarthritis, right hip",
          "isPrimaryAdmissionDiagnosis": true,
          "isSuspectedHacCondition": false,
          "firstObservedDateTime": "2026-03-15T09:00:00.000Z"
        },
        {
          "code": "I26.99",
          "description": "Other pulmonary embolism without acute cor pulmonale",
          "isPrimaryAdmissionDiagnosis": false,
          "isSuspectedHacCondition": true,
          "firstObservedDateTime": "2026-03-17T08:00:00.000Z"
        }
      ],
      "procedures": [
        {
          "code": "81.51",
          "description": "Total hip replacement, right",
          "performedDateTime": "2026-03-15T11:00:00.000Z",
          "isPlannedOnAdmission": true
        },
        {
          "code": "87.41",
          "description": "Computed tomography of thorax (CTPA)",
          "performedDateTime": "2026-03-17T09:30:00.000Z",
          "isPlannedOnAdmission": false,
          "isImagingOrDiagnostic": true,
          "hasAbnormalResult": true
        },
        {
          "code": "99.19",
          "description": "Continuous intravenous therapeutic heparin infusion rescue",
          "performedDateTime": "2026-03-17T10:00:00.000Z",
          "isPlannedOnAdmission": false,
          "isRescueDrug": true,
          "isRescueIntervention": true
        }
      ],
      "isPatientHistoryAvailable": true,
      "patientHistory": []
    }
  ],
  "notes": [
    {
      "id": "NOTE-0841-01",
      "claimId": "CLM-2026-0841",
      "author": "Dr. Sarah Al-Busaidi",
      "authorRole": "Chief Medical Officer",
      "content": "Patient developed high fever (39.2°C) and wound erythema on post-op Day 3. Swab showed heavy growth of MRSA. Surgical washout and drainage performed.",
      "createdAt": "2026-03-14T09:30:00.000Z"
    },
    {
      "id": "NOTE-1123-01",
      "claimId": "CLM-2026-1123",
      "author": "Dr. Tariq Al-Hinai",
      "authorRole": "Clinical Auditor",
      "content": "Foley catheter placed on admission. Mid-stay dysuria and positive urine culture (>100k CFU/mL E. coli) on Day 3. Initiated rescue IV Ceftriaxone.",
      "createdAt": "2026-03-17T11:15:00.000Z"
    }
  ],
  "decisions": [
    {
      "id": "DEC-3392-01",
      "claimId": "CLM-2026-3392",
      "outcome": "NO_CONCERN",
      "rationale": "Stage 1 sacral pressure injury was explicitly documented upon physical intake at emergency admission. Timing proves Present On Admission (POA = Yes).",
      "reviewerId": "REV-009",
      "reviewerName": "Clinical QA Lead",
      "decidedAt": "2026-03-21T10:00:00.000Z"
    }
  ],
  "queue": {
    "items": [
      {
        "claimId": "CLM-2026-0841",
        "patientId": "PAT-9401",
        "admissionDateTime": "2026-03-10T08:00:00.000Z",
        "dischargeDateTime": "2026-03-18T14:00:00.000Z",
        "primaryDiagnosisCode": "K80.00",
        "hacDiagnosisCode": "T81.4XXA",
        "score": 90,
        "signalLevel": "HIGH",
        "encounterType": "INPATIENT",
        "reviewStatus": "NEW",
        "providerId": "PRV-MUSCAT-01",
        "providerDisplayName": "Muscat General Hospital",
        "dataQualityStatus": "PARTIAL",
        "notesCount": 1
      },
      {
        "claimId": "CLM-2026-1123",
        "patientId": "PAT-5529",
        "admissionDateTime": "2026-03-14T11:00:00.000Z",
        "dischargeDateTime": "2026-03-19T10:00:00.000Z",
        "primaryDiagnosisCode": "I50.9",
        "hacDiagnosisCode": "T83.511A",
        "score": 69,
        "signalLevel": "REVIEW",
        "encounterType": "INPATIENT",
        "reviewStatus": "IN_REVIEW",
        "providerId": "PRV-SALALAH-04",
        "providerDisplayName": "Salalah Care Center",
        "dataQualityStatus": "PARTIAL",
        "notesCount": 1
      },
      {
        "claimId": "CLM-2026-2049",
        "patientId": "PAT-3180",
        "admissionDateTime": "2026-03-18T06:00:00.000Z",
        "dischargeDateTime": "2026-03-24T18:00:00.000Z",
        "primaryDiagnosisCode": "I63.9",
        "hacDiagnosisCode": "L89.152",
        "score": 55,
        "signalLevel": "REVIEW",
        "encounterType": "INPATIENT",
        "reviewStatus": "MONITORING",
        "providerId": "PRV-NIZWA-02",
        "providerDisplayName": "Nizwa Regional Hospital",
        "dataQualityStatus": "PARTIAL",
        "notesCount": 0
      },
      {
        "claimId": "CLM-2026-4401",
        "patientId": "PAT-8812",
        "admissionDateTime": "2026-03-15T09:00:00.000Z",
        "dischargeDateTime": "2026-03-22T12:00:00.000Z",
        "primaryDiagnosisCode": "M16.11",
        "hacDiagnosisCode": "I26.99",
        "score": 53,
        "signalLevel": "REVIEW",
        "encounterType": "INPATIENT",
        "reviewStatus": "IN_REVIEW",
        "providerId": "PRV-MUSCAT-02",
        "providerDisplayName": "Sultan Qaboos Medical City",
        "dataQualityStatus": "PARTIAL",
        "notesCount": 0
      },
      {
        "claimId": "CLM-2026-3392",
        "patientId": "PAT-7215",
        "admissionDateTime": "2026-03-20T14:00:00.000Z",
        "dischargeDateTime": "2026-03-23T11:00:00.000Z",
        "primaryDiagnosisCode": "S72.001A",
        "hacDiagnosisCode": "L89.311",
        "score": 10,
        "signalLevel": "NONE",
        "encounterType": "INPATIENT",
        "reviewStatus": "RESOLVED",
        "providerId": "PRV-SOHAR-01",
        "providerDisplayName": "Sohar Medical Complex",
        "dataQualityStatus": "PARTIAL",
        "notesCount": 0,
        "lastDecision": "NO_CONCERN"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "total": 5,
      "totalPages": 1
    },
    "summaryCounts": {
      "total": 5,
      "highPriority": 1,
      "inReview": 2,
      "confirmed": 0
    }
  },
  "analytics": {
    "generatedAt": "2026-09-29T08:20:35.752Z",
    "summary": {
      "totalCases": 5,
      "averageScore": 55,
      "highPriority": 1,
      "confirmed": 0,
      "signalDistribution": {
        "HIGH": 1,
        "REVIEW": 3,
        "MONITOR": 0,
        "NONE": 1
      }
    },
    "componentTotals": {
      "coding": 42,
      "timing": 72,
      "relatedness": 50,
      "intervention": 98,
      "history": 15
    },
    "providers": [
      {
        "providerId": "PRV-MUSCAT-01",
        "provider": "Muscat General Hospital",
        "cases": 1,
        "high": 1,
        "averageScore": 90
      },
      {
        "providerId": "PRV-SALALAH-04",
        "provider": "Salalah Care Center",
        "cases": 1,
        "high": 0,
        "averageScore": 69
      },
      {
        "providerId": "PRV-NIZWA-02",
        "provider": "Nizwa Regional Hospital",
        "cases": 1,
        "high": 0,
        "averageScore": 55
      },
      {
        "providerId": "PRV-MUSCAT-02",
        "provider": "Sultan Qaboos Medical City",
        "cases": 1,
        "high": 0,
        "averageScore": 53
      },
      {
        "providerId": "PRV-SOHAR-01",
        "provider": "Sohar Medical Complex",
        "cases": 1,
        "high": 0,
        "averageScore": 10
      }
    ],
    "topDiagnoses": [
      {
        "code": "T81.4XXA",
        "cases": 1,
        "averageScore": 90,
        "maxScore": 90
      },
      {
        "code": "T83.511A",
        "cases": 1,
        "averageScore": 69,
        "maxScore": 69
      },
      {
        "code": "L89.152",
        "cases": 1,
        "averageScore": 55,
        "maxScore": 55
      },
      {
        "code": "I26.99",
        "cases": 1,
        "averageScore": 53,
        "maxScore": 53
      },
      {
        "code": "L89.311",
        "cases": 1,
        "averageScore": 10,
        "maxScore": 10
      }
    ]
  },
  "investigations": {
    "CLM-2026-0841": {
      "claimId": "CLM-2026-0841",
      "patientId": "PAT-9401",
      "patientAge": 58,
      "patientGender": "F",
      "provider": {
        "id": "PRV-MUSCAT-01",
        "facilityCode": "FAC-MCT-001",
        "displayName": "Muscat General Hospital"
      },
      "stayTimestamps": {
        "admissionDateTime": "2026-03-10T08:00:00.000Z",
        "dischargeDateTime": "2026-03-18T14:00:00.000Z",
        "lengthOfStayDays": 8
      },
      "signalResult": {
        "score": 90,
        "level": "HIGH",
        "action": "HUMAN_REVIEW",
        "summaryHeadline": "High likelihood of an in-stay complication pattern",
        "summaryDescription": "The signal is driven mainly by a new condition appearing late in the stay and an unplanned return to theatre."
      },
      "findingsCards": [
        {
          "key": "timing",
          "title": "New condition appeared after admission",
          "headline": "First detected 75 hours after admission",
          "summary": "The diagnosis first appeared 75 hours after admission, meeting the >=48 hour threshold.",
          "level": "Strong evidence",
          "tone": "high",
          "points": 20,
          "maxPoints": 20
        },
        {
          "key": "path",
          "title": "Patient path changed unexpectedly",
          "headline": "Clinical pathway divergence detected",
          "summary": "No approved clinical relationship map or trained AI patient-path model is connected for Calculus of gallbladder with acute cholecystitis without obstruction → Infection following a procedure, deep surgical site infection, initial encounter. The system therefore returns UNKNOWN rather than inferring an unrelated relationship.",
          "level": "Moderate evidence",
          "tone": "medium",
          "points": 10,
          "maxPoints": 20
        },
        {
          "key": "intervention",
          "title": "Unexpected intervention was required",
          "headline": "Patient required: Reopening of recent laparotomy with incision and drainage / surgical debridement",
          "summary": "Return to theatre contributed 25 base points plus 6 modifier points; Component D is capped at 25.",
          "level": "Very strong evidence",
          "tone": "critical",
          "points": 25,
          "maxPoints": 25
        },
        {
          "key": "coding",
          "title": "Diagnosis wording supports a complication pattern",
          "headline": "T81.4XXA - The descriptor explicitly names a care event",
          "summary": "The ICD-10 descriptor explicitly attributes the diagnosis to a post-procedural complication or care event.",
          "level": "Direct admission",
          "tone": "high",
          "points": 20,
          "maxPoints": 20
        },
        {
          "key": "history",
          "title": "Previous provider history checked",
          "headline": "Linked prior procedure: Exploration of common bile duct (18d prior)",
          "summary": "A related procedure was found at the same provider 18 days before the current claim.",
          "level": "Linked readmission",
          "tone": "high",
          "points": 15,
          "maxPoints": 15
        }
      ],
      "technicalBreakdown": {
        "rows": [
          {
            "component": "A",
            "label": "Diagnosis pattern",
            "bandAndDescription": "A1 · The descriptor explicitly names a care event",
            "scoreDisplay": "20 / 20",
            "points": 20,
            "maxPoints": 20
          },
          {
            "component": "B",
            "label": "Timing / inferred POA",
            "bandAndDescription": "B1 · First appears 48 hours or more after admission",
            "scoreDisplay": "20 / 20",
            "points": 20,
            "maxPoints": 20
          },
          {
            "component": "C",
            "label": "Clinical relatedness",
            "bandAndDescription": "UNKNOWN · Clinical relationship not yet resolved",
            "scoreDisplay": "10 / 20",
            "points": 10,
            "maxPoints": 20
          },
          {
            "component": "D",
            "label": "Triggered intervention",
            "bandAndDescription": "RETURN_TO_THEATRE · Return to theatre",
            "scoreDisplay": "25 / 25",
            "points": 25,
            "maxPoints": 25
          },
          {
            "component": "E",
            "label": "Provider linkage",
            "bandAndDescription": "SAME_PROVIDER_30D · Procedure at this provider within 30 days",
            "scoreDisplay": "15 / 15",
            "points": 15,
            "maxPoints": 15
          }
        ],
        "componentA": {
          "component": "A",
          "title": "Cause transparency of the diagnosis",
          "code": "T81.4XXA",
          "description": "Infection following a procedure, deep surgical site infection, initial encounter",
          "band": "A1",
          "bandLabel": "The descriptor explicitly names a care event",
          "points": 20,
          "maxPoints": 20,
          "reasoning": "The ICD-10 descriptor explicitly attributes the diagnosis to a post-procedural complication or care event."
        },
        "componentB": {
          "component": "B",
          "title": "New mid-stay indication (Timing / Inferred POA)",
          "admissionDateTime": "2026-03-10T08:00:00.000Z",
          "thresholdHours": 48,
          "earlyWindowHours": 24,
          "maxPoints": 20,
          "band": "B1",
          "bandLabel": "First appears 48 hours or more after admission",
          "firstObservedDateTime": "2026-03-13T11:00:00.000Z",
          "elapsedHoursFromAdmission": 75,
          "points": 20,
          "timingInferred": true,
          "reasoning": "The diagnosis first appeared 75 hours after admission, meeting the >=48 hour threshold."
        },
        "componentC": {
          "component": "C",
          "title": "Clinical relatedness to the admission indication",
          "outcome": "UNKNOWN",
          "outcomeLabel": "Clinical relationship not yet resolved",
          "points": 10,
          "maxPoints": 20,
          "pathwaySimilarityPercent": null,
          "deviationConfidence": null,
          "aiEvidenceAvailable": false,
          "aiEvidenceStatus": "NOT_CONNECTED",
          "expectedPathway": [],
          "actualPathway": [],
          "divergencePoint": "",
          "reasoning": "No approved clinical relationship map or trained AI patient-path model is connected for Calculus of gallbladder with acute cholecystitis without obstruction → Infection following a procedure, deep surgical site infection, initial encounter. The system therefore returns UNKNOWN rather than inferring an unrelated relationship."
        },
        "componentD": {
          "component": "D",
          "title": "Unplanned intervention triggered",
          "category": "RETURN_TO_THEATRE",
          "categoryLabel": "Return to theatre",
          "triggerProcedureCode": "49002",
          "triggerProcedureDescription": "Reopening of recent laparotomy with incision and drainage / surgical debridement",
          "rawModifierPoints": 31,
          "basePoints": 25,
          "modifiers": [
            {
              "type": "NO_PREAPPROVAL",
              "points": 3,
              "reason": "A mid-stay service that ordinarily requires pre-approval was delivered without approval."
            },
            {
              "type": "RESCUE_DRUG",
              "points": 3,
              "reason": "A rescue/reversal drug was documented after admission."
            }
          ],
          "points": 25,
          "maxPoints": 25,
          "isCeilingApplied": true,
          "reasoning": "Return to theatre contributed 25 base points plus 6 modifier points; Component D is capped at 25."
        },
        "componentE": {
          "component": "E",
          "title": "Provider linkage",
          "outcome": "SAME_PROVIDER_30D",
          "outcomeLabel": "Procedure at this provider within 30 days",
          "lookbackDaysSearched": 90,
          "historyAvailable": true,
          "linkedPriorClaimId": "CLM-2026-0412",
          "linkedPriorProcedure": "Exploration of common bile duct (18d prior)",
          "linkedPriorDays": 18,
          "points": 15,
          "maxPoints": 15,
          "reasoning": "A related procedure was found at the same provider 18 days before the current claim."
        }
      },
      "timeline": [
        {
          "id": "evt-adm-CLM-2026-0841",
          "dateTime": "2026-03-10T08:00:00.000Z",
          "formattedDateTime": "10 Mar · 10:00",
          "elapsedHours": 0,
          "eventType": "admission",
          "title": "Admitted to Inpatient Care",
          "subtitle": "Calculus of gallbladder with acute cholecystitis without obstruction",
          "status": "normal",
          "code": "K80.00",
          "details": [
            "Admission Diagnosis: K80.00 - Calculus of gallbladder with acute cholecystitis without obstruction",
            "Provider Facility: FAC-MCT-001 (Muscat General Hospital)",
            "Inpatient admission established"
          ]
        },
        {
          "id": "evt-proc-0-CLM-2026-0841",
          "dateTime": "2026-03-10T11:30:00.000Z",
          "formattedDateTime": "10 Mar · 13:30",
          "elapsedHours": 3.5,
          "eventType": "procedure",
          "title": "Planned Surgery / Procedure",
          "subtitle": "Laparoscopic cholecystectomy",
          "status": "positive",
          "code": "47562",
          "details": [
            "Procedure Code: 47562",
            "Standard surgical protocol",
            "Initial operative treatment as part of admission plan"
          ]
        },
        {
          "id": "evt-diag-1-CLM-2026-0841",
          "dateTime": "2026-03-13T11:00:00.000Z",
          "formattedDateTime": "13 Mar · 13:00",
          "elapsedHours": 75,
          "eventType": "diagnosis",
          "title": "New Condition Documented (HAC Signal)",
          "subtitle": "Infection following a procedure, deep surgical site infection, initial encounter",
          "status": "warning",
          "code": "T81.4XXA",
          "details": [
            "Diagnosis Code: T81.4XXA - Infection following a procedure, deep surgical site infection, initial encounter",
            "First appearance: 75 hours after admission",
            "Condition was not documented on admission-day claim lines"
          ]
        },
        {
          "id": "evt-proc-2-CLM-2026-0841",
          "dateTime": "2026-03-13T12:00:00.000Z",
          "formattedDateTime": "13 Mar · 14:00",
          "elapsedHours": 76,
          "eventType": "procedure",
          "title": "Secondary In-Stay Procedure",
          "subtitle": "Injection or infusion of broad-spectrum antibiotic rescue agent (Vancomycin)",
          "status": "warning",
          "code": "99.18",
          "details": [
            "Procedure Code: 99.18",
            "Standard surgical protocol",
            "Intervention required during stay"
          ]
        },
        {
          "id": "evt-diag-2-CLM-2026-0841",
          "dateTime": "2026-03-13T16:00:00.000Z",
          "formattedDateTime": "13 Mar · 18:00",
          "elapsedHours": 80,
          "eventType": "diagnosis",
          "title": "Secondary Diagnosis Recorded",
          "subtitle": "Sepsis, unspecified organism",
          "status": "normal",
          "code": "A41.9",
          "details": [
            "Diagnosis Code: A41.9 - Sepsis, unspecified organism",
            "First appearance: 80 hours after admission",
            "Co-morbid condition"
          ]
        },
        {
          "id": "evt-proc-1-CLM-2026-0841",
          "dateTime": "2026-03-14T07:15:00.000Z",
          "formattedDateTime": "14 Mar · 09:15",
          "elapsedHours": 95.3,
          "eventType": "procedure",
          "title": "Returned to Theatre (Unplanned)",
          "subtitle": "Reopening of recent laparotomy with incision and drainage / surgical debridement",
          "status": "critical",
          "code": "49002",
          "details": [
            "Procedure Code: 49002",
            "Standard surgical protocol",
            "Unplanned re-exploration in same body system"
          ]
        },
        {
          "id": "evt-dis-CLM-2026-0841",
          "dateTime": "2026-03-18T14:00:00.000Z",
          "formattedDateTime": "18 Mar · 16:00",
          "elapsedHours": 198,
          "eventType": "discharge",
          "title": "Discharged from Facility",
          "subtitle": "Stay completed",
          "status": "positive",
          "details": [
            "Total length of stay: 8 days",
            "Discharge claim processed and routed for human clinical review",
            "No automated penalty or denial applied"
          ]
        }
      ],
      "clinicalPath": {
        "expected": [],
        "actual": [],
        "divergencePoint": "",
        "similarityPercent": null,
        "deviationConfidence": null,
        "aiEvidenceAvailable": false,
        "aiEvidenceStatus": "NOT_CONNECTED"
      },
      "dataQuality": {
        "overallStatus": "PARTIAL",
        "isReliable": true,
        "flags": [
          {
            "code": "DQ_INFO_UNMAPPED_CLINICAL_RELATIONSHIP",
            "severity": "INFO",
            "field": "clinicalRelatedness",
            "message": "The admission-to-new-diagnosis relationship is currently unmapped/unknown.",
            "mitigation": "Route the pair to Clinical + AI relationship review; do not treat unknown as unrelated."
          }
        ]
      },
      "suppressors": {
        "rawScore": 90,
        "finalScore": 90,
        "applied": [],
        "isScoreCapped": true
      },
      "workflow": {
        "reviewStatus": "NEW",
        "notesCount": 1
      },
      "audit": {
        "modelVersion": "rules-engine-no-ai-model",
        "rulesVersion": "hac-spec-a-e-v1",
        "calculatedAt": "2026-09-29T08:20:35.748Z",
        "dataVersion": "persistent-runtime-store-v1",
        "calculationHash": "73ef44d09ce7955a566ee0b4bbff1b4cfce0b03096b3f7b6368a0ebeb63c66aa"
      }
    },
    "CLM-2026-1123": {
      "claimId": "CLM-2026-1123",
      "patientId": "PAT-5529",
      "patientAge": 69,
      "patientGender": "M",
      "provider": {
        "id": "PRV-SALALAH-04",
        "facilityCode": "FAC-SLL-004",
        "displayName": "Salalah Care Center"
      },
      "stayTimestamps": {
        "admissionDateTime": "2026-03-14T11:00:00.000Z",
        "dischargeDateTime": "2026-03-19T10:00:00.000Z",
        "lengthOfStayDays": 5
      },
      "signalResult": {
        "score": 69,
        "level": "REVIEW",
        "action": "HUMAN_REVIEW",
        "summaryHeadline": "Moderate complication signal requiring clinical review",
        "summaryDescription": "Timing or procedural escalation suggests an in-stay event warranting review."
      },
      "findingsCards": [
        {
          "key": "timing",
          "title": "New condition appeared after admission",
          "headline": "First detected 52.5 hours after admission",
          "summary": "The diagnosis first appeared 52.5 hours after admission, meeting the >=48 hour threshold.",
          "level": "Strong evidence",
          "tone": "high",
          "points": 20,
          "maxPoints": 20
        },
        {
          "key": "path",
          "title": "Patient path changed unexpectedly",
          "headline": "Clinical pathway divergence detected",
          "summary": "No approved clinical relationship map or trained AI patient-path model is connected for Heart failure, unspecified decompensated → Infection and inflammatory reaction due to indwelling urinary catheter, initial encounter. The system therefore returns UNKNOWN rather than inferring an unrelated relationship.",
          "level": "Moderate evidence",
          "tone": "medium",
          "points": 10,
          "maxPoints": 20
        },
        {
          "key": "intervention",
          "title": "Unexpected intervention was required",
          "headline": "Patient required: Infusion of targeted rescue antibiotic therapy (Ceftriaxone)",
          "summary": "High-acuity rescue intervention contributed 20 base points plus 3 modifier points; Component D is capped at 25.",
          "level": "Very strong evidence",
          "tone": "critical",
          "points": 23,
          "maxPoints": 25
        },
        {
          "key": "coding",
          "title": "Diagnosis wording supports a complication pattern",
          "headline": "T83.511A - The descriptor names a device or a drug",
          "summary": "The descriptor attributes the condition to an internal prosthetic device, implant, graft, or therapeutic agent.",
          "level": "Direct admission",
          "tone": "high",
          "points": 16,
          "maxPoints": 20
        },
        {
          "key": "history",
          "title": "Previous provider history checked",
          "headline": "No prior related procedure found",
          "summary": "No related prior procedure was found in the available 90-day history.",
          "level": "No added evidence",
          "tone": "neutral",
          "points": 0,
          "maxPoints": 15
        }
      ],
      "technicalBreakdown": {
        "rows": [
          {
            "component": "A",
            "label": "Diagnosis pattern",
            "bandAndDescription": "A2 · The descriptor names a device or a drug",
            "scoreDisplay": "16 / 20",
            "points": 16,
            "maxPoints": 20
          },
          {
            "component": "B",
            "label": "Timing / inferred POA",
            "bandAndDescription": "B1 · First appears 48 hours or more after admission",
            "scoreDisplay": "20 / 20",
            "points": 20,
            "maxPoints": 20
          },
          {
            "component": "C",
            "label": "Clinical relatedness",
            "bandAndDescription": "UNKNOWN · Clinical relationship not yet resolved",
            "scoreDisplay": "10 / 20",
            "points": 10,
            "maxPoints": 20
          },
          {
            "component": "D",
            "label": "Triggered intervention",
            "bandAndDescription": "HIGH_ACUITY_RESCUE · High-acuity rescue intervention",
            "scoreDisplay": "23 / 25",
            "points": 23,
            "maxPoints": 25
          },
          {
            "component": "E",
            "label": "Provider linkage",
            "bandAndDescription": "NOTHING_FOUND · No prior related procedure found",
            "scoreDisplay": "0 / 15",
            "points": 0,
            "maxPoints": 15
          }
        ],
        "componentA": {
          "component": "A",
          "title": "Cause transparency of the diagnosis",
          "code": "T83.511A",
          "description": "Infection and inflammatory reaction due to indwelling urinary catheter, initial encounter",
          "band": "A2",
          "bandLabel": "The descriptor names a device or a drug",
          "points": 16,
          "maxPoints": 20,
          "reasoning": "The descriptor attributes the condition to an internal prosthetic device, implant, graft, or therapeutic agent."
        },
        "componentB": {
          "component": "B",
          "title": "New mid-stay indication (Timing / Inferred POA)",
          "admissionDateTime": "2026-03-14T11:00:00.000Z",
          "thresholdHours": 48,
          "earlyWindowHours": 24,
          "maxPoints": 20,
          "band": "B1",
          "bandLabel": "First appears 48 hours or more after admission",
          "firstObservedDateTime": "2026-03-16T15:30:00.000Z",
          "elapsedHoursFromAdmission": 52.5,
          "points": 20,
          "timingInferred": true,
          "reasoning": "The diagnosis first appeared 52.5 hours after admission, meeting the >=48 hour threshold."
        },
        "componentC": {
          "component": "C",
          "title": "Clinical relatedness to the admission indication",
          "outcome": "UNKNOWN",
          "outcomeLabel": "Clinical relationship not yet resolved",
          "points": 10,
          "maxPoints": 20,
          "pathwaySimilarityPercent": null,
          "deviationConfidence": null,
          "aiEvidenceAvailable": false,
          "aiEvidenceStatus": "NOT_CONNECTED",
          "expectedPathway": [],
          "actualPathway": [],
          "divergencePoint": "",
          "reasoning": "No approved clinical relationship map or trained AI patient-path model is connected for Heart failure, unspecified decompensated → Infection and inflammatory reaction due to indwelling urinary catheter, initial encounter. The system therefore returns UNKNOWN rather than inferring an unrelated relationship."
        },
        "componentD": {
          "component": "D",
          "title": "Unplanned intervention triggered",
          "category": "HIGH_ACUITY_RESCUE",
          "categoryLabel": "High-acuity rescue intervention",
          "triggerProcedureCode": "99.21",
          "triggerProcedureDescription": "Infusion of targeted rescue antibiotic therapy (Ceftriaxone)",
          "rawModifierPoints": 23,
          "basePoints": 20,
          "modifiers": [
            {
              "type": "RESCUE_DRUG",
              "points": 3,
              "reason": "A rescue/reversal drug was documented after admission."
            }
          ],
          "points": 23,
          "maxPoints": 25,
          "isCeilingApplied": false,
          "reasoning": "High-acuity rescue intervention contributed 20 base points plus 3 modifier points; Component D is capped at 25."
        },
        "componentE": {
          "component": "E",
          "title": "Provider linkage",
          "outcome": "NOTHING_FOUND",
          "outcomeLabel": "No prior related procedure found",
          "lookbackDaysSearched": 90,
          "historyAvailable": true,
          "points": 0,
          "maxPoints": 15,
          "reasoning": "No related prior procedure was found in the available 90-day history."
        }
      },
      "timeline": [
        {
          "id": "evt-adm-CLM-2026-1123",
          "dateTime": "2026-03-14T11:00:00.000Z",
          "formattedDateTime": "14 Mar · 13:00",
          "elapsedHours": 0,
          "eventType": "admission",
          "title": "Admitted to Inpatient Care",
          "subtitle": "Heart failure, unspecified decompensated",
          "status": "normal",
          "code": "I50.9",
          "details": [
            "Admission Diagnosis: I50.9 - Heart failure, unspecified decompensated",
            "Provider Facility: FAC-SLL-004 (Salalah Care Center)",
            "Inpatient admission established"
          ]
        },
        {
          "id": "evt-proc-0-CLM-2026-1123",
          "dateTime": "2026-03-14T13:00:00.000Z",
          "formattedDateTime": "14 Mar · 15:00",
          "elapsedHours": 2,
          "eventType": "procedure",
          "title": "Planned Surgery / Procedure",
          "subtitle": "Insertion of indwelling urinary catheter",
          "status": "positive",
          "code": "57.94",
          "details": [
            "Procedure Code: 57.94",
            "Standard surgical protocol",
            "Initial operative treatment as part of admission plan"
          ]
        },
        {
          "id": "evt-diag-1-CLM-2026-1123",
          "dateTime": "2026-03-16T15:30:00.000Z",
          "formattedDateTime": "16 Mar · 17:30",
          "elapsedHours": 52.5,
          "eventType": "diagnosis",
          "title": "New Condition Documented (HAC Signal)",
          "subtitle": "Infection and inflammatory reaction due to indwelling urinary catheter, initial encounter",
          "status": "warning",
          "code": "T83.511A",
          "details": [
            "Diagnosis Code: T83.511A - Infection and inflammatory reaction due to indwelling urinary catheter, initial encounter",
            "First appearance: 52.5 hours after admission",
            "Condition was not documented on admission-day claim lines"
          ]
        },
        {
          "id": "evt-diag-2-CLM-2026-1123",
          "dateTime": "2026-03-16T15:30:00.000Z",
          "formattedDateTime": "16 Mar · 17:30",
          "elapsedHours": 52.5,
          "eventType": "diagnosis",
          "title": "Secondary Diagnosis Recorded",
          "subtitle": "Urinary tract infection, site not specified",
          "status": "normal",
          "code": "N39.0",
          "details": [
            "Diagnosis Code: N39.0 - Urinary tract infection, site not specified",
            "First appearance: 52.5 hours after admission",
            "Co-morbid condition"
          ]
        },
        {
          "id": "evt-proc-1-CLM-2026-1123",
          "dateTime": "2026-03-16T17:00:00.000Z",
          "formattedDateTime": "16 Mar · 19:00",
          "elapsedHours": 54,
          "eventType": "icu_transfer",
          "title": "Critical Care Rescue Escalation",
          "subtitle": "Infusion of targeted rescue antibiotic therapy (Ceftriaxone)",
          "status": "critical",
          "code": "99.21",
          "details": [
            "Procedure Code: 99.21",
            "Standard surgical protocol",
            "Intervention required during stay"
          ]
        },
        {
          "id": "evt-dis-CLM-2026-1123",
          "dateTime": "2026-03-19T10:00:00.000Z",
          "formattedDateTime": "19 Mar · 12:00",
          "elapsedHours": 119,
          "eventType": "discharge",
          "title": "Discharged from Facility",
          "subtitle": "Stay completed",
          "status": "positive",
          "details": [
            "Total length of stay: 5 days",
            "Discharge claim processed and routed for human clinical review",
            "No automated penalty or denial applied"
          ]
        }
      ],
      "clinicalPath": {
        "expected": [],
        "actual": [],
        "divergencePoint": "",
        "similarityPercent": null,
        "deviationConfidence": null,
        "aiEvidenceAvailable": false,
        "aiEvidenceStatus": "NOT_CONNECTED"
      },
      "dataQuality": {
        "overallStatus": "PARTIAL",
        "isReliable": true,
        "flags": [
          {
            "code": "DQ_INFO_UNMAPPED_CLINICAL_RELATIONSHIP",
            "severity": "INFO",
            "field": "clinicalRelatedness",
            "message": "The admission-to-new-diagnosis relationship is currently unmapped/unknown.",
            "mitigation": "Route the pair to Clinical + AI relationship review; do not treat unknown as unrelated."
          }
        ]
      },
      "suppressors": {
        "rawScore": 69,
        "finalScore": 69,
        "applied": [],
        "isScoreCapped": false
      },
      "workflow": {
        "reviewStatus": "IN_REVIEW",
        "notesCount": 1
      },
      "audit": {
        "modelVersion": "rules-engine-no-ai-model",
        "rulesVersion": "hac-spec-a-e-v1",
        "calculatedAt": "2026-09-29T08:20:35.748Z",
        "dataVersion": "persistent-runtime-store-v1",
        "calculationHash": "437fdf80bea6ea1dc262983f8fd5c55905c8309b44f36ac33866ceeeaa54189d"
      }
    },
    "CLM-2026-2049": {
      "claimId": "CLM-2026-2049",
      "patientId": "PAT-3180",
      "patientAge": 76,
      "patientGender": "F",
      "provider": {
        "id": "PRV-NIZWA-02",
        "facilityCode": "FAC-NZW-002",
        "displayName": "Nizwa Regional Hospital"
      },
      "stayTimestamps": {
        "admissionDateTime": "2026-03-18T06:00:00.000Z",
        "dischargeDateTime": "2026-03-24T18:00:00.000Z",
        "lengthOfStayDays": 6
      },
      "signalResult": {
        "score": 55,
        "level": "REVIEW",
        "action": "HUMAN_REVIEW",
        "summaryHeadline": "Moderate complication signal requiring clinical review",
        "summaryDescription": "Timing or procedural escalation suggests an in-stay event warranting review."
      },
      "findingsCards": [
        {
          "key": "timing",
          "title": "New condition appeared after admission",
          "headline": "First detected 75 hours after admission",
          "summary": "The diagnosis first appeared 75 hours after admission, meeting the >=48 hour threshold.",
          "level": "Strong evidence",
          "tone": "high",
          "points": 20,
          "maxPoints": 20
        },
        {
          "key": "path",
          "title": "Patient path changed unexpectedly",
          "headline": "Clinical pathway divergence detected",
          "summary": "No approved clinical relationship map or trained AI patient-path model is connected for Cerebral infarction, unspecified (Acute ischemic stroke) → Pressure ulcer of sacral region, stage 2. The system therefore returns UNKNOWN rather than inferring an unrelated relationship.",
          "level": "Moderate evidence",
          "tone": "medium",
          "points": 10,
          "maxPoints": 20
        },
        {
          "key": "intervention",
          "title": "Unexpected intervention was required",
          "headline": "Patient required: Nonexcisional debridement and specialized wound barrier dressing",
          "summary": "Return to theatre contributed 25 base points; Component D is capped at 25.",
          "level": "Very strong evidence",
          "tone": "critical",
          "points": 25,
          "maxPoints": 25
        },
        {
          "key": "coding",
          "title": "Diagnosis wording supports a complication pattern",
          "headline": "L89.152 - Standard disease diagnosis (everything else)",
          "summary": "The code descriptor contains no mention of surgical procedure, device, or acute post-procedural complication.",
          "level": "Standard diagnosis",
          "tone": "neutral",
          "points": 0,
          "maxPoints": 20
        },
        {
          "key": "history",
          "title": "Previous provider history checked",
          "headline": "Member history unavailable",
          "summary": "Member longitudinal history was unavailable. Absence of a prior procedure must not be interpreted as a clean history.",
          "level": "History unavailable",
          "tone": "neutral",
          "points": 0,
          "maxPoints": 15
        }
      ],
      "technicalBreakdown": {
        "rows": [
          {
            "component": "A",
            "label": "Diagnosis pattern",
            "bandAndDescription": "A6 · Standard disease diagnosis (everything else)",
            "scoreDisplay": "0 / 20",
            "points": 0,
            "maxPoints": 20
          },
          {
            "component": "B",
            "label": "Timing / inferred POA",
            "bandAndDescription": "B1 · First appears 48 hours or more after admission",
            "scoreDisplay": "20 / 20",
            "points": 20,
            "maxPoints": 20
          },
          {
            "component": "C",
            "label": "Clinical relatedness",
            "bandAndDescription": "UNKNOWN · Clinical relationship not yet resolved",
            "scoreDisplay": "10 / 20",
            "points": 10,
            "maxPoints": 20
          },
          {
            "component": "D",
            "label": "Triggered intervention",
            "bandAndDescription": "RETURN_TO_THEATRE · Return to theatre",
            "scoreDisplay": "25 / 25",
            "points": 25,
            "maxPoints": 25
          },
          {
            "component": "E",
            "label": "Provider linkage",
            "bandAndDescription": "UNAVAILABLE · Member history unavailable",
            "scoreDisplay": "0 / 15",
            "points": 0,
            "maxPoints": 15
          }
        ],
        "componentA": {
          "component": "A",
          "title": "Cause transparency of the diagnosis",
          "code": "L89.152",
          "description": "Pressure ulcer of sacral region, stage 2",
          "band": "A6",
          "bandLabel": "Standard disease diagnosis (everything else)",
          "points": 0,
          "maxPoints": 20,
          "reasoning": "The code descriptor contains no mention of surgical procedure, device, or acute post-procedural complication."
        },
        "componentB": {
          "component": "B",
          "title": "New mid-stay indication (Timing / Inferred POA)",
          "admissionDateTime": "2026-03-18T06:00:00.000Z",
          "thresholdHours": 48,
          "earlyWindowHours": 24,
          "maxPoints": 20,
          "band": "B1",
          "bandLabel": "First appears 48 hours or more after admission",
          "firstObservedDateTime": "2026-03-21T09:00:00.000Z",
          "elapsedHoursFromAdmission": 75,
          "points": 20,
          "timingInferred": true,
          "reasoning": "The diagnosis first appeared 75 hours after admission, meeting the >=48 hour threshold."
        },
        "componentC": {
          "component": "C",
          "title": "Clinical relatedness to the admission indication",
          "outcome": "UNKNOWN",
          "outcomeLabel": "Clinical relationship not yet resolved",
          "points": 10,
          "maxPoints": 20,
          "pathwaySimilarityPercent": null,
          "deviationConfidence": null,
          "aiEvidenceAvailable": false,
          "aiEvidenceStatus": "NOT_CONNECTED",
          "expectedPathway": [],
          "actualPathway": [],
          "divergencePoint": "",
          "reasoning": "No approved clinical relationship map or trained AI patient-path model is connected for Cerebral infarction, unspecified (Acute ischemic stroke) → Pressure ulcer of sacral region, stage 2. The system therefore returns UNKNOWN rather than inferring an unrelated relationship."
        },
        "componentD": {
          "component": "D",
          "title": "Unplanned intervention triggered",
          "category": "RETURN_TO_THEATRE",
          "categoryLabel": "Return to theatre",
          "triggerProcedureCode": "86.28",
          "triggerProcedureDescription": "Nonexcisional debridement and specialized wound barrier dressing",
          "rawModifierPoints": 25,
          "basePoints": 25,
          "modifiers": [],
          "points": 25,
          "maxPoints": 25,
          "isCeilingApplied": false,
          "reasoning": "Return to theatre contributed 25 base points; Component D is capped at 25."
        },
        "componentE": {
          "component": "E",
          "title": "Provider linkage",
          "outcome": "UNAVAILABLE",
          "outcomeLabel": "Member history unavailable",
          "lookbackDaysSearched": 90,
          "historyAvailable": false,
          "points": 0,
          "maxPoints": 15,
          "reasoning": "Member longitudinal history was unavailable. Absence of a prior procedure must not be interpreted as a clean history."
        }
      },
      "timeline": [
        {
          "id": "evt-adm-CLM-2026-2049",
          "dateTime": "2026-03-18T06:00:00.000Z",
          "formattedDateTime": "18 Mar · 08:00",
          "elapsedHours": 0,
          "eventType": "admission",
          "title": "Admitted to Inpatient Care",
          "subtitle": "Cerebral infarction, unspecified (Acute ischemic stroke)",
          "status": "normal",
          "code": "I63.9",
          "details": [
            "Admission Diagnosis: I63.9 - Cerebral infarction, unspecified (Acute ischemic stroke)",
            "Provider Facility: FAC-NZW-002 (Nizwa Regional Hospital)",
            "Inpatient admission established"
          ]
        },
        {
          "id": "evt-diag-1-CLM-2026-2049",
          "dateTime": "2026-03-21T09:00:00.000Z",
          "formattedDateTime": "21 Mar · 11:00",
          "elapsedHours": 75,
          "eventType": "diagnosis",
          "title": "New Condition Documented (HAC Signal)",
          "subtitle": "Pressure ulcer of sacral region, stage 2",
          "status": "warning",
          "code": "L89.152",
          "details": [
            "Diagnosis Code: L89.152 - Pressure ulcer of sacral region, stage 2",
            "First appearance: 75 hours after admission",
            "Condition was not documented on admission-day claim lines"
          ]
        },
        {
          "id": "evt-proc-0-CLM-2026-2049",
          "dateTime": "2026-03-21T11:00:00.000Z",
          "formattedDateTime": "21 Mar · 13:00",
          "elapsedHours": 77,
          "eventType": "procedure",
          "title": "Secondary In-Stay Procedure",
          "subtitle": "Nonexcisional debridement and specialized wound barrier dressing",
          "status": "warning",
          "code": "86.28",
          "details": [
            "Procedure Code: 86.28",
            "Standard surgical protocol",
            "Intervention required during stay"
          ]
        },
        {
          "id": "evt-dis-CLM-2026-2049",
          "dateTime": "2026-03-24T18:00:00.000Z",
          "formattedDateTime": "24 Mar · 20:00",
          "elapsedHours": 156,
          "eventType": "discharge",
          "title": "Discharged from Facility",
          "subtitle": "Stay completed",
          "status": "positive",
          "details": [
            "Total length of stay: 6 days",
            "Discharge claim processed and routed for human clinical review",
            "No automated penalty or denial applied"
          ]
        }
      ],
      "clinicalPath": {
        "expected": [],
        "actual": [],
        "divergencePoint": "",
        "similarityPercent": null,
        "deviationConfidence": null,
        "aiEvidenceAvailable": false,
        "aiEvidenceStatus": "NOT_CONNECTED"
      },
      "dataQuality": {
        "overallStatus": "PARTIAL",
        "isReliable": true,
        "flags": [
          {
            "code": "DQ_INFO_HISTORY_UNAVAILABLE",
            "severity": "INFO",
            "field": "patientHistory",
            "message": "Cross-facility member claims history was not searchable for this episode.",
            "mitigation": "Component E will record history unavailable rather than absence of complication."
          },
          {
            "code": "DQ_INFO_UNMAPPED_CLINICAL_RELATIONSHIP",
            "severity": "INFO",
            "field": "clinicalRelatedness",
            "message": "The admission-to-new-diagnosis relationship is currently unmapped/unknown.",
            "mitigation": "Route the pair to Clinical + AI relationship review; do not treat unknown as unrelated."
          }
        ]
      },
      "suppressors": {
        "rawScore": 55,
        "finalScore": 55,
        "applied": [],
        "isScoreCapped": false
      },
      "workflow": {
        "reviewStatus": "MONITORING",
        "notesCount": 0
      },
      "audit": {
        "modelVersion": "rules-engine-no-ai-model",
        "rulesVersion": "hac-spec-a-e-v1",
        "calculatedAt": "2026-09-29T08:20:35.748Z",
        "dataVersion": "persistent-runtime-store-v1",
        "calculationHash": "ff17f3b22b15e5010dccf422db3376719e84d2351c5f2ac7c85f462d93a27560"
      }
    },
    "CLM-2026-3392": {
      "claimId": "CLM-2026-3392",
      "patientId": "PAT-7215",
      "patientAge": 71,
      "patientGender": "M",
      "provider": {
        "id": "PRV-SOHAR-01",
        "facilityCode": "FAC-SHR-001",
        "displayName": "Sohar Medical Complex"
      },
      "stayTimestamps": {
        "admissionDateTime": "2026-03-20T14:00:00.000Z",
        "dischargeDateTime": "2026-03-23T11:00:00.000Z",
        "lengthOfStayDays": 3
      },
      "signalResult": {
        "score": 10,
        "level": "NONE",
        "action": "HUMAN_REVIEW",
        "summaryHeadline": "No significant hospital-acquired complication signal",
        "summaryDescription": "Events are consistent with admission indication or known clinical progression."
      },
      "findingsCards": [
        {
          "key": "timing",
          "title": "New condition appeared after admission",
          "headline": "First detected 0 hours after admission",
          "summary": "The diagnosis was already present on the admission line; no mid-stay timing signal is assigned.",
          "level": "No in-stay timing signal",
          "tone": "neutral",
          "points": 0,
          "maxPoints": 20
        },
        {
          "key": "path",
          "title": "Patient path changed unexpectedly",
          "headline": "Clinical pathway divergence detected",
          "summary": "No approved clinical relationship map or trained AI patient-path model is connected for Fracture of unspecified part of neck of right femur, initial encounter → Pressure ulcer of right buttock, stage 1 (Present on admission). The system therefore returns UNKNOWN rather than inferring an unrelated relationship.",
          "level": "Moderate evidence",
          "tone": "medium",
          "points": 10,
          "maxPoints": 20
        },
        {
          "key": "intervention",
          "title": "Unexpected intervention was required",
          "headline": "No classified intervention triggered",
          "summary": "No classified intervention was identified. Modifiers do not fire independently of an intervention band.",
          "level": "No acute escalation",
          "tone": "neutral",
          "points": 0,
          "maxPoints": 25
        },
        {
          "key": "coding",
          "title": "Diagnosis wording supports a complication pattern",
          "headline": "L89.311 - Standard disease diagnosis (everything else)",
          "summary": "The code descriptor contains no mention of surgical procedure, device, or acute post-procedural complication.",
          "level": "Standard diagnosis",
          "tone": "neutral",
          "points": 0,
          "maxPoints": 20
        },
        {
          "key": "history",
          "title": "Previous provider history checked",
          "headline": "No prior related procedure found",
          "summary": "No related prior procedure was found in the available 90-day history.",
          "level": "No added evidence",
          "tone": "neutral",
          "points": 0,
          "maxPoints": 15
        }
      ],
      "technicalBreakdown": {
        "rows": [
          {
            "component": "A",
            "label": "Diagnosis pattern",
            "bandAndDescription": "A6 · Standard disease diagnosis (everything else)",
            "scoreDisplay": "0 / 20",
            "points": 0,
            "maxPoints": 20
          },
          {
            "component": "B",
            "label": "Timing / inferred POA",
            "bandAndDescription": "B4 · Present on admission line",
            "scoreDisplay": "0 / 20",
            "points": 0,
            "maxPoints": 20
          },
          {
            "component": "C",
            "label": "Clinical relatedness",
            "bandAndDescription": "UNKNOWN · Clinical relationship not yet resolved",
            "scoreDisplay": "10 / 20",
            "points": 10,
            "maxPoints": 20
          },
          {
            "component": "D",
            "label": "Triggered intervention",
            "bandAndDescription": "NO_INTERVENTION · No classified intervention triggered",
            "scoreDisplay": "0 / 25",
            "points": 0,
            "maxPoints": 25
          },
          {
            "component": "E",
            "label": "Provider linkage",
            "bandAndDescription": "NOTHING_FOUND · No prior related procedure found",
            "scoreDisplay": "0 / 15",
            "points": 0,
            "maxPoints": 15
          }
        ],
        "componentA": {
          "component": "A",
          "title": "Cause transparency of the diagnosis",
          "code": "L89.311",
          "description": "Pressure ulcer of right buttock, stage 1 (Present on admission)",
          "band": "A6",
          "bandLabel": "Standard disease diagnosis (everything else)",
          "points": 0,
          "maxPoints": 20,
          "reasoning": "The code descriptor contains no mention of surgical procedure, device, or acute post-procedural complication."
        },
        "componentB": {
          "component": "B",
          "title": "New mid-stay indication (Timing / Inferred POA)",
          "admissionDateTime": "2026-03-20T14:00:00.000Z",
          "thresholdHours": 48,
          "earlyWindowHours": 24,
          "maxPoints": 20,
          "band": "B4",
          "bandLabel": "Present on admission line",
          "firstObservedDateTime": "2026-03-20T14:00:00.000Z",
          "elapsedHoursFromAdmission": 0,
          "points": 0,
          "timingInferred": true,
          "reasoning": "The diagnosis was already present on the admission line; no mid-stay timing signal is assigned."
        },
        "componentC": {
          "component": "C",
          "title": "Clinical relatedness to the admission indication",
          "outcome": "UNKNOWN",
          "outcomeLabel": "Clinical relationship not yet resolved",
          "points": 10,
          "maxPoints": 20,
          "pathwaySimilarityPercent": null,
          "deviationConfidence": null,
          "aiEvidenceAvailable": false,
          "aiEvidenceStatus": "NOT_CONNECTED",
          "expectedPathway": [],
          "actualPathway": [],
          "divergencePoint": "",
          "reasoning": "No approved clinical relationship map or trained AI patient-path model is connected for Fracture of unspecified part of neck of right femur, initial encounter → Pressure ulcer of right buttock, stage 1 (Present on admission). The system therefore returns UNKNOWN rather than inferring an unrelated relationship."
        },
        "componentD": {
          "component": "D",
          "title": "Unplanned intervention triggered",
          "category": "NO_INTERVENTION",
          "categoryLabel": "No classified intervention triggered",
          "rawModifierPoints": 0,
          "basePoints": 0,
          "modifiers": [],
          "points": 0,
          "maxPoints": 25,
          "isCeilingApplied": false,
          "reasoning": "No classified intervention was identified. Modifiers do not fire independently of an intervention band."
        },
        "componentE": {
          "component": "E",
          "title": "Provider linkage",
          "outcome": "NOTHING_FOUND",
          "outcomeLabel": "No prior related procedure found",
          "lookbackDaysSearched": 90,
          "historyAvailable": true,
          "points": 0,
          "maxPoints": 15,
          "reasoning": "No related prior procedure was found in the available 90-day history."
        }
      },
      "timeline": [
        {
          "id": "evt-adm-CLM-2026-3392",
          "dateTime": "2026-03-20T14:00:00.000Z",
          "formattedDateTime": "20 Mar · 16:00",
          "elapsedHours": 0,
          "eventType": "admission",
          "title": "Admitted to Inpatient Care",
          "subtitle": "Fracture of unspecified part of neck of right femur, initial encounter",
          "status": "normal",
          "code": "S72.001A",
          "details": [
            "Admission Diagnosis: S72.001A - Fracture of unspecified part of neck of right femur, initial encounter",
            "Provider Facility: FAC-SHR-001 (Sohar Medical Complex)",
            "Inpatient admission established"
          ]
        },
        {
          "id": "evt-diag-1-CLM-2026-3392",
          "dateTime": "2026-03-20T14:00:00.000Z",
          "formattedDateTime": "20 Mar · 16:00",
          "elapsedHours": 0,
          "eventType": "diagnosis",
          "title": "New Condition Documented (HAC Signal)",
          "subtitle": "Pressure ulcer of right buttock, stage 1 (Present on admission)",
          "status": "warning",
          "code": "L89.311",
          "details": [
            "Diagnosis Code: L89.311 - Pressure ulcer of right buttock, stage 1 (Present on admission)",
            "First appearance: 0 hours after admission",
            "Condition was not documented on admission-day claim lines"
          ]
        },
        {
          "id": "evt-proc-0-CLM-2026-3392",
          "dateTime": "2026-03-21T09:00:00.000Z",
          "formattedDateTime": "21 Mar · 11:00",
          "elapsedHours": 19,
          "eventType": "procedure",
          "title": "Planned Surgery / Procedure",
          "subtitle": "Open reduction of fracture with internal fixation, femur",
          "status": "positive",
          "code": "79.35",
          "details": [
            "Procedure Code: 79.35",
            "Standard surgical protocol",
            "Initial operative treatment as part of admission plan"
          ]
        },
        {
          "id": "evt-dis-CLM-2026-3392",
          "dateTime": "2026-03-23T11:00:00.000Z",
          "formattedDateTime": "23 Mar · 13:00",
          "elapsedHours": 69,
          "eventType": "discharge",
          "title": "Discharged from Facility",
          "subtitle": "Stay completed",
          "status": "positive",
          "details": [
            "Total length of stay: 3 days",
            "Discharge claim processed and routed for human clinical review",
            "No automated penalty or denial applied"
          ]
        }
      ],
      "clinicalPath": {
        "expected": [],
        "actual": [],
        "divergencePoint": "",
        "similarityPercent": null,
        "deviationConfidence": null,
        "aiEvidenceAvailable": false,
        "aiEvidenceStatus": "NOT_CONNECTED"
      },
      "dataQuality": {
        "overallStatus": "PARTIAL",
        "isReliable": true,
        "flags": [
          {
            "code": "DQ_INFO_UNMAPPED_CLINICAL_RELATIONSHIP",
            "severity": "INFO",
            "field": "clinicalRelatedness",
            "message": "The admission-to-new-diagnosis relationship is currently unmapped/unknown.",
            "mitigation": "Route the pair to Clinical + AI relationship review; do not treat unknown as unrelated."
          }
        ]
      },
      "suppressors": {
        "rawScore": 10,
        "finalScore": 10,
        "applied": [],
        "isScoreCapped": false
      },
      "workflow": {
        "reviewStatus": "RESOLVED",
        "notesCount": 0,
        "lastDecision": "NO_CONCERN"
      },
      "audit": {
        "modelVersion": "rules-engine-no-ai-model",
        "rulesVersion": "hac-spec-a-e-v1",
        "calculatedAt": "2026-09-29T08:20:35.749Z",
        "dataVersion": "persistent-runtime-store-v1",
        "calculationHash": "554b57d308f586385c59df25b8aaa77aacf1d0f5ca380e522d6875a41a9f8fc9"
      }
    },
    "CLM-2026-4401": {
      "claimId": "CLM-2026-4401",
      "patientId": "PAT-8812",
      "patientAge": 64,
      "patientGender": "F",
      "provider": {
        "id": "PRV-MUSCAT-02",
        "facilityCode": "FAC-MCT-002",
        "displayName": "Sultan Qaboos Medical City"
      },
      "stayTimestamps": {
        "admissionDateTime": "2026-03-15T09:00:00.000Z",
        "dischargeDateTime": "2026-03-22T12:00:00.000Z",
        "lengthOfStayDays": 7
      },
      "signalResult": {
        "score": 53,
        "level": "REVIEW",
        "action": "HUMAN_REVIEW",
        "summaryHeadline": "Moderate complication signal requiring clinical review",
        "summaryDescription": "Timing or procedural escalation suggests an in-stay event warranting review."
      },
      "findingsCards": [
        {
          "key": "timing",
          "title": "New condition appeared after admission",
          "headline": "First detected 47 hours after admission",
          "summary": "The diagnosis first appeared 47 hours after admission, within the 24-48 hour window.",
          "level": "Moderate evidence",
          "tone": "medium",
          "points": 12,
          "maxPoints": 20
        },
        {
          "key": "path",
          "title": "Patient path changed unexpectedly",
          "headline": "Clinical pathway divergence detected",
          "summary": "No approved clinical relationship map or trained AI patient-path model is connected for Unilateral primary osteoarthritis, right hip → Other pulmonary embolism without acute cor pulmonale. The system therefore returns UNKNOWN rather than inferring an unrelated relationship.",
          "level": "Moderate evidence",
          "tone": "medium",
          "points": 10,
          "maxPoints": 20
        },
        {
          "key": "intervention",
          "title": "Unexpected intervention was required",
          "headline": "Patient required: Continuous intravenous therapeutic heparin infusion rescue",
          "summary": "High-acuity rescue intervention contributed 20 base points plus 5 modifier points; Component D is capped at 25.",
          "level": "Very strong evidence",
          "tone": "critical",
          "points": 25,
          "maxPoints": 25
        },
        {
          "key": "coding",
          "title": "Diagnosis wording supports a complication pattern",
          "headline": "I26.99 - On a complication list, but silent on cause",
          "summary": "The condition (e.g. acute kidney injury, catheter UTI, hospital-acquired pneumonia, DVT) is monitored for HAC, but the code descriptor is silent on etiology.",
          "level": "Supporting evidence",
          "tone": "medium",
          "points": 6,
          "maxPoints": 20
        },
        {
          "key": "history",
          "title": "Previous provider history checked",
          "headline": "No prior related procedure found",
          "summary": "No related prior procedure was found in the available 90-day history.",
          "level": "No added evidence",
          "tone": "neutral",
          "points": 0,
          "maxPoints": 15
        }
      ],
      "technicalBreakdown": {
        "rows": [
          {
            "component": "A",
            "label": "Diagnosis pattern",
            "bandAndDescription": "A5 · On a complication list, but silent on cause",
            "scoreDisplay": "6 / 20",
            "points": 6,
            "maxPoints": 20
          },
          {
            "component": "B",
            "label": "Timing / inferred POA",
            "bandAndDescription": "B2 · First appears between 24 and 48 hours",
            "scoreDisplay": "12 / 20",
            "points": 12,
            "maxPoints": 20
          },
          {
            "component": "C",
            "label": "Clinical relatedness",
            "bandAndDescription": "UNKNOWN · Clinical relationship not yet resolved",
            "scoreDisplay": "10 / 20",
            "points": 10,
            "maxPoints": 20
          },
          {
            "component": "D",
            "label": "Triggered intervention",
            "bandAndDescription": "HIGH_ACUITY_RESCUE · High-acuity rescue intervention",
            "scoreDisplay": "25 / 25",
            "points": 25,
            "maxPoints": 25
          },
          {
            "component": "E",
            "label": "Provider linkage",
            "bandAndDescription": "NOTHING_FOUND · No prior related procedure found",
            "scoreDisplay": "0 / 15",
            "points": 0,
            "maxPoints": 15
          }
        ],
        "componentA": {
          "component": "A",
          "title": "Cause transparency of the diagnosis",
          "code": "I26.99",
          "description": "Other pulmonary embolism without acute cor pulmonale",
          "band": "A5",
          "bandLabel": "On a complication list, but silent on cause",
          "points": 6,
          "maxPoints": 20,
          "reasoning": "The condition (e.g. acute kidney injury, catheter UTI, hospital-acquired pneumonia, DVT) is monitored for HAC, but the code descriptor is silent on etiology."
        },
        "componentB": {
          "component": "B",
          "title": "New mid-stay indication (Timing / Inferred POA)",
          "admissionDateTime": "2026-03-15T09:00:00.000Z",
          "thresholdHours": 48,
          "earlyWindowHours": 24,
          "maxPoints": 20,
          "band": "B2",
          "bandLabel": "First appears between 24 and 48 hours",
          "firstObservedDateTime": "2026-03-17T08:00:00.000Z",
          "elapsedHoursFromAdmission": 47,
          "points": 12,
          "timingInferred": true,
          "reasoning": "The diagnosis first appeared 47 hours after admission, within the 24-48 hour window."
        },
        "componentC": {
          "component": "C",
          "title": "Clinical relatedness to the admission indication",
          "outcome": "UNKNOWN",
          "outcomeLabel": "Clinical relationship not yet resolved",
          "points": 10,
          "maxPoints": 20,
          "pathwaySimilarityPercent": null,
          "deviationConfidence": null,
          "aiEvidenceAvailable": false,
          "aiEvidenceStatus": "NOT_CONNECTED",
          "expectedPathway": [],
          "actualPathway": [],
          "divergencePoint": "",
          "reasoning": "No approved clinical relationship map or trained AI patient-path model is connected for Unilateral primary osteoarthritis, right hip → Other pulmonary embolism without acute cor pulmonale. The system therefore returns UNKNOWN rather than inferring an unrelated relationship."
        },
        "componentD": {
          "component": "D",
          "title": "Unplanned intervention triggered",
          "category": "HIGH_ACUITY_RESCUE",
          "categoryLabel": "High-acuity rescue intervention",
          "triggerProcedureCode": "99.19",
          "triggerProcedureDescription": "Continuous intravenous therapeutic heparin infusion rescue",
          "rawModifierPoints": 25,
          "basePoints": 20,
          "modifiers": [
            {
              "type": "RESCUE_DRUG",
              "points": 3,
              "reason": "A rescue/reversal drug was documented after admission."
            },
            {
              "type": "ABNORMAL_RESULT",
              "points": 2,
              "reason": "An investigation linked to the event returned an abnormal result."
            }
          ],
          "points": 25,
          "maxPoints": 25,
          "isCeilingApplied": false,
          "reasoning": "High-acuity rescue intervention contributed 20 base points plus 5 modifier points; Component D is capped at 25."
        },
        "componentE": {
          "component": "E",
          "title": "Provider linkage",
          "outcome": "NOTHING_FOUND",
          "outcomeLabel": "No prior related procedure found",
          "lookbackDaysSearched": 90,
          "historyAvailable": true,
          "points": 0,
          "maxPoints": 15,
          "reasoning": "No related prior procedure was found in the available 90-day history."
        }
      },
      "timeline": [
        {
          "id": "evt-adm-CLM-2026-4401",
          "dateTime": "2026-03-15T09:00:00.000Z",
          "formattedDateTime": "15 Mar · 11:00",
          "elapsedHours": 0,
          "eventType": "admission",
          "title": "Admitted to Inpatient Care",
          "subtitle": "Unilateral primary osteoarthritis, right hip",
          "status": "normal",
          "code": "M16.11",
          "details": [
            "Admission Diagnosis: M16.11 - Unilateral primary osteoarthritis, right hip",
            "Provider Facility: FAC-MCT-002 (Sultan Qaboos Medical City)",
            "Inpatient admission established"
          ]
        },
        {
          "id": "evt-proc-0-CLM-2026-4401",
          "dateTime": "2026-03-15T11:00:00.000Z",
          "formattedDateTime": "15 Mar · 13:00",
          "elapsedHours": 2,
          "eventType": "procedure",
          "title": "Planned Surgery / Procedure",
          "subtitle": "Total hip replacement, right",
          "status": "positive",
          "code": "81.51",
          "details": [
            "Procedure Code: 81.51",
            "Standard surgical protocol",
            "Initial operative treatment as part of admission plan"
          ]
        },
        {
          "id": "evt-diag-1-CLM-2026-4401",
          "dateTime": "2026-03-17T08:00:00.000Z",
          "formattedDateTime": "17 Mar · 10:00",
          "elapsedHours": 47,
          "eventType": "diagnosis",
          "title": "New Condition Documented (HAC Signal)",
          "subtitle": "Other pulmonary embolism without acute cor pulmonale",
          "status": "warning",
          "code": "I26.99",
          "details": [
            "Diagnosis Code: I26.99 - Other pulmonary embolism without acute cor pulmonale",
            "First appearance: 47 hours after admission",
            "Condition was not documented on admission-day claim lines"
          ]
        },
        {
          "id": "evt-proc-1-CLM-2026-4401",
          "dateTime": "2026-03-17T09:30:00.000Z",
          "formattedDateTime": "17 Mar · 11:30",
          "elapsedHours": 48.5,
          "eventType": "procedure",
          "title": "Secondary In-Stay Procedure",
          "subtitle": "Computed tomography of thorax (CTPA)",
          "status": "warning",
          "code": "87.41",
          "details": [
            "Procedure Code: 87.41",
            "Standard surgical protocol",
            "Intervention required during stay"
          ]
        },
        {
          "id": "evt-proc-2-CLM-2026-4401",
          "dateTime": "2026-03-17T10:00:00.000Z",
          "formattedDateTime": "17 Mar · 12:00",
          "elapsedHours": 49,
          "eventType": "icu_transfer",
          "title": "Critical Care Rescue Escalation",
          "subtitle": "Continuous intravenous therapeutic heparin infusion rescue",
          "status": "critical",
          "code": "99.19",
          "details": [
            "Procedure Code: 99.19",
            "Standard surgical protocol",
            "Intervention required during stay"
          ]
        },
        {
          "id": "evt-dis-CLM-2026-4401",
          "dateTime": "2026-03-22T12:00:00.000Z",
          "formattedDateTime": "22 Mar · 14:00",
          "elapsedHours": 171,
          "eventType": "discharge",
          "title": "Discharged from Facility",
          "subtitle": "Stay completed",
          "status": "positive",
          "details": [
            "Total length of stay: 7 days",
            "Discharge claim processed and routed for human clinical review",
            "No automated penalty or denial applied"
          ]
        }
      ],
      "clinicalPath": {
        "expected": [],
        "actual": [],
        "divergencePoint": "",
        "similarityPercent": null,
        "deviationConfidence": null,
        "aiEvidenceAvailable": false,
        "aiEvidenceStatus": "NOT_CONNECTED"
      },
      "dataQuality": {
        "overallStatus": "PARTIAL",
        "isReliable": true,
        "flags": [
          {
            "code": "DQ_INFO_UNMAPPED_CLINICAL_RELATIONSHIP",
            "severity": "INFO",
            "field": "clinicalRelatedness",
            "message": "The admission-to-new-diagnosis relationship is currently unmapped/unknown.",
            "mitigation": "Route the pair to Clinical + AI relationship review; do not treat unknown as unrelated."
          }
        ]
      },
      "suppressors": {
        "rawScore": 53,
        "finalScore": 53,
        "applied": [],
        "isScoreCapped": false
      },
      "workflow": {
        "reviewStatus": "IN_REVIEW",
        "notesCount": 0
      },
      "audit": {
        "modelVersion": "rules-engine-no-ai-model",
        "rulesVersion": "hac-spec-a-e-v1",
        "calculatedAt": "2026-09-29T08:20:35.749Z",
        "dataVersion": "persistent-runtime-store-v1",
        "calculationHash": "2e549fd12f2bbbdab3ecacb59e015784ebb6577992d59f7bafa741991f818f41"
      }
    }
  }
} as const;
