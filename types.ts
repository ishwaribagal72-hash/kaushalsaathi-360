export type UserRole = 'learner' | 'parent' | 'counsellor' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'mr';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  // Role specific links
  linkedLearnerId?: string; // For parent
  counsellorSpecialization?: string; // For counsellor
  verified?: boolean;
}

export interface LearnerProfile {
  userId: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  educationLevel: '8th_pass' | '10th_pass' | '12th_pass_arts' | '12th_pass_science' | '12th_pass_commerce' | 'iti_pursuing' | 'iti_completed' | 'polytechnic_diploma';
  state: string;
  district: string;
  ruralUrban: 'rural' | 'semi-urban' | 'urban';
  preferredLanguage: LanguageCode;
  familyAnnualIncome: '<1.5L' | '1.5L-3L' | '3L-6L' | '>6L';
  willingToRelocate: 'within_district' | 'within_state' | 'pan_india' | 'no';
  financialConstraints: 'high' | 'medium' | 'low';
  interests: string[];
  skills: string[];
  aptitudeScores?: {
    mechanical: number;
    spatial: number;
    digital: number;
    practical: number;
    peopleCare: number;
  };
}

export interface AssessmentQuestion {
  id: string;
  type: 'aptitude' | 'interest' | 'skill';
  category: 'mechanical' | 'spatial' | 'digital' | 'practical' | 'peopleCare' | 'environmental';
  question: {
    en: string;
    hi: string;
    mr: string;
  };
  options: {
    id: string;
    text: {
      en: string;
      hi: string;
      mr: string;
    };
    scoreWeight: Record<string, number>;
  }[];
}

export interface EvidenceSource {
  id: string;
  name: string;
  type: 'NCVET_REPORT' | 'GOVT_GAZETTE' | 'PLFS_SURVEY' | 'SECTOR_SKILL_COUNCIL' | 'NAPS_PORTAL' | 'STATE_SKILL_MISSION';
  publishingAuthority: string;
  publicationDate: string;
  lastVerifiedDate: string;
  geography: string;
  evidenceQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  urlOrCitation: string;
  isVerified: boolean;
}

export interface EvidenceClaim {
  id: string;
  careerId: string;
  claimType: 'SALARY_RANGE' | 'JOB_GROWTH' | 'SAFETY_RATING' | 'PLACEMENT_RATE' | 'SCHEME_ELIGIBILITY';
  claimStatement: {
    en: string;
    hi: string;
    mr: string;
  };
  metricValue: string;
  evidenceSourceId: string;
  confidence: number;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'UNKNOWN';
}

export interface CareerRole {
  id: string;
  title: {
    en: string;
    hi: string;
    mr: string;
  };
  sector: string;
  nsqfLevel: number;
  description: {
    en: string;
    hi: string;
    mr: string;
  };
  requiredEducation: string;
  trainingDurationMonths: number;
  monthlyStipendDuringTraining: string;
  entryMonthlySalaryRange: string;
  midCareerMonthlySalaryRange: string;
  growthRate5Yr: string;
  safetyScore: number; // 0-100
  jobStabilityScore: number; // 0-100
  socialAcceptanceScore: number; // 0-100
  suitableForWomenScore: number; // 0-100
  skillsRequired: string[];
  associatedInstitutes: {
    name: string;
    type: 'Govt ITI' | 'Polytechnic' | 'PMKK' | 'Private ITI';
    location: string;
  }[];
  governmentSchemes: string[];
  pathwayOptions: {
    pathA: CareerPathway;
    pathB: CareerPathway;
    pathC: CareerPathway;
  };
  evidenceIds: string[];
  status: 'active' | 'in_review';
}

export interface CareerPathway {
  id: string;
  pathType: 'Apprenticeship (NAPS)' | 'Higher Technical Diploma (CITS)' | 'Entrepreneurship / Mudra';
  title: string;
  durationMonths: number;
  estimatedCostINR: number;
  stipendOrEarningsDuringStageINR: number;
  stages: {
    step: number;
    title: string;
    milestone: string;
    timelineMonths: number;
  }[];
  progressionOutlook: string;
  evidenceConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RecommendationWhyBreakdown {
  interestMatch: number; // percentage
  skillMatch: number;
  locationFeasibility: number;
  trainingAvailability: number;
  familyAlignment: number;
  evidenceConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  keyReasons: string[];
}

export interface CareerRecommendation {
  careerId: string;
  career: CareerRole;
  overallFitScore: number;
  confidenceScore: number;
  whyBreakdown: RecommendationWhyBreakdown;
  humanEscalationRequired: boolean;
  escalationReason?: string;
  saved?: boolean;
}

export interface ParentConcern {
  category: 'salary' | 'safety' | 'job_security' | 'cost' | 'distance' | 'social_status';
  concernLevel: 'high' | 'medium' | 'low';
  note?: string;
  preferredAlternativeSector?: string;
}

export interface FamilyConsensusCase {
  id: string;
  learnerId: string;
  learnerName: string;
  parentId: string;
  parentName: string;
  selectedCareerId: string;
  selectedCareerTitle: string;
  learnerPreferenceVector: {
    passionWeight: number; // 0-100
    willingToTravel: number;
    techAffinity: number;
    handsOnPreference: number;
    entrepreneurialDrive: number;
  };
  parentConcernVector: {
    salaryConcern: number; // 0-100
    safetyConcern: number;
    jobSecurityConcern: number;
    trainingCostConcern: number;
    distanceConcern: number;
    socialStatusConcern: number;
  };
  agreementScore: number; // 0-100
  conflictAreas: {
    topic: string;
    severity: 'critical' | 'moderate' | 'minor';
    learnerPosition: string;
    parentPosition: string;
    verifiedEvidenceClaim?: EvidenceClaim;
    suggestedDiscussionPrompt: string;
  }[];
  unresolvedQuestions: string[];
  status: 'PENDING_DISCUSSION' | 'COUNSELLOR_MEDIATION_REQUESTED' | 'AGREED' | 'RESOLVED_WITH_PLAN';
  updatedAt: string;
}

export interface CounsellorCase {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerPhone: string;
  parentId?: string;
  parentName?: string;
  assignedCounsellorId: string;
  assignedCounsellorName: string;
  topCareerRecommendationId: string;
  overallConfidence: number;
  status: 'ASSIGNED' | 'IN_REVIEW' | 'FAMILY_CALL_SCHEDULED' | 'RECOMMENDATION_OVERRIDDEN' | 'RESOLVED';
  riskCategory: 'HIGH_RISK_DROPOUT' | 'FAMILY_CONFLICT' | 'LOW_EVIDENCE_CONFIDENCE' | 'SMOOTH_ALIGNMENT';
  counsellorNotes: {
    id: string;
    authorName: string;
    createdAt: string;
    note: string;
    actionTaken: string;
  }[];
  overrideDetails?: {
    overriddenCareerId: string;
    newCareerId: string;
    reason: string;
    authorizedAt: string;
  };
  actionPlanId?: string;
  updatedAt: string;
}

export interface ActionPlanMilestone {
  id: string;
  title: string;
  category: 'ASSESSMENT' | 'TRAINING_ADMISSION' | 'SCHEME_APPLICATION' | 'APPRENTICESHIP' | 'JOB_PLACEMENT';
  targetDate: string;
  completed: boolean;
  notes?: string;
  portalLink?: string;
}

export interface ActionPlan {
  id: string;
  learnerId: string;
  careerId: string;
  careerTitle: string;
  selectedPathway: string;
  targetCompletionMonths: number;
  milestones: ActionPlanMilestone[];
  counsellorApproved: boolean;
  parentConsentApproved: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  ipAddress: string;
  securityStatus: 'SUCCESS' | 'WARNING' | 'DENIED';
  metadata?: Record<string, any>;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'assessment' | 'recommendation' | 'counsellor' | 'family' | 'milestone' | 'security';
  read: boolean;
  createdAt: string;
}

export interface SystemAnalytics {
  totalLearners: number;
  totalParents: number;
  totalCounsellors: number;
  assessmentsCompleted: number;
  recommendationsGenerated: number;
  familyAgreementsReached: number;
  counsellorEscalationsResolved: number;
  averageConfidenceScore: number;
  evidenceClaimsVerifiedRate: number;
  topSectorsChosen: { sector: string; count: number }[];
}

export interface ConsentSettings {
  learnerProfileProcessing: boolean;
  shareWithGuardian: boolean;
  counsellorAccess: boolean;
  anonymizedResearchContribution: boolean;
  voiceAudioTranscriptionRetention: boolean;
  consentTimestamp: string;
}
