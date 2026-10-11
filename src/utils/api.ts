import {
  User,
  LearnerProfile,
  CareerRole,
  AssessmentQuestion,
  CareerRecommendation,
  FamilyConsensusCase,
  CounsellorCase,
  ActionPlan,
  AuditLog,
  NotificationItem,
  SystemAnalytics,
  EvidenceSource,
  EvidenceClaim,
  ConsentSettings,
} from '../types';

export const api = {
  // Auth
  login: async (email: string, role?: string): Promise<{ token: string; user: User }> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    return res.json();
  },

  getUsers: async (): Promise<User[]> => {
    const res = await fetch('/api/auth/users');
    return res.json();
  },

  // Profiles
  getLearnerProfile: async (id: string): Promise<LearnerProfile> => {
    const res = await fetch(`/api/profile/learner/${id}`);
    return res.json();
  },

  updateLearnerProfile: async (id: string, data: Partial<LearnerProfile>): Promise<LearnerProfile> => {
    const res = await fetch(`/api/profile/learner/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Assessments
  getAssessmentQuestions: async (): Promise<AssessmentQuestion[]> => {
    const res = await fetch('/api/assessments/questions');
    return res.json();
  },

  submitAssessment: async (
    learnerId: string,
    answers: { questionId: string; optionId: string }[]
  ): Promise<{ status: string; scores: LearnerProfile['aptitudeScores'] }> => {
    const res = await fetch('/api/assessments/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnerId, answers }),
    });
    return res.json();
  },

  // Careers & Recommendations
  getCareers: async (): Promise<CareerRole[]> => {
    const res = await fetch('/api/careers');
    return res.json();
  },

  getCareerById: async (id: string): Promise<CareerRole & { linkedClaims?: EvidenceClaim[] }> => {
    const res = await fetch(`/api/careers/${id}`);
    return res.json();
  },

  getRecommendations: async (
    learnerId: string
  ): Promise<{ recommendations: CareerRecommendation[] }> => {
    const res = await fetch('/api/recommendations/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnerId }),
    });
    return res.json();
  },

  // Family Consensus
  getFamilyCase: async (learnerId: string): Promise<FamilyConsensusCase> => {
    const res = await fetch(`/api/family/case/${learnerId}`);
    return res.json();
  },

  updateFamilyConcerns: async (
    learnerId: string,
    concerns: Partial<FamilyConsensusCase['parentConcernVector']>,
    selectedCareerId?: string
  ): Promise<FamilyConsensusCase> => {
    const res = await fetch('/api/family/update-concerns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnerId, parentConcernVector: concerns, selectedCareerId }),
    });
    return res.json();
  },

  requestCounsellorMediation: async (
    learnerId: string,
    reason: string
  ): Promise<{ status: string; familyCase: FamilyConsensusCase }> => {
    const res = await fetch('/api/family/request-counsellor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ learnerId, reason }),
    });
    return res.json();
  },

  // Evidence Trust Engine
  getEvidenceSources: async (): Promise<EvidenceSource[]> => {
    const res = await fetch('/api/evidence/sources');
    return res.json();
  },

  getEvidenceClaims: async (): Promise<EvidenceClaim[]> => {
    const res = await fetch('/api/evidence/claims');
    return res.json();
  },

  verifyClaim: async (claimId: string, verifiedByGazette: string): Promise<{ status: string; claim: EvidenceClaim }> => {
    const res = await fetch('/api/evidence/verify-claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, verifiedByGazette }),
    });
    return res.json();
  },

  queryEvidence: async (query: string, careerId?: string): Promise<any> => {
    const res = await fetch('/api/evidence/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, careerId }),
    });
    return res.json();
  },

  // AI & RAG
  askAiCounsel: async (
    question: string,
    language: string,
    learnerId: string
  ): Promise<{
    answer: string;
    citations: string[];
    evidenceQuality: string;
    confidenceScore: number;
    disclaimer: string;
  }> => {
    const res = await fetch('/api/ai/counsel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, language, learnerId }),
    });
    return res.json();
  },

  generateTts: async (text: string): Promise<{ audioBase64?: string; useWebSpeechFallback?: boolean }> => {
    const res = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    return res.json();
  },

  // Counsellor Desk
  getCounsellorCases: async (): Promise<CounsellorCase[]> => {
    const res = await fetch('/api/counsellor/cases');
    return res.json();
  },

  getCounsellorCaseDetails: async (id: string): Promise<any> => {
    const res = await fetch(`/api/counsellor/cases/${id}`);
    return res.json();
  },

  addCounsellorNote: async (
    caseId: string,
    note: string,
    actionTaken: string,
    counsellorName: string
  ): Promise<CounsellorCase> => {
    const res = await fetch(`/api/counsellor/cases/${caseId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, actionTaken, counsellorName }),
    });
    return res.json();
  },

  overrideAiRecommendation: async (
    caseId: string,
    newCareerId: string,
    reason: string,
    counsellorName: string
  ): Promise<CounsellorCase> => {
    const res = await fetch(`/api/counsellor/cases/${caseId}/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newCareerId, reason, counsellorName }),
    });
    return res.json();
  },

  // Action Plans
  getActionPlan: async (learnerId: string): Promise<ActionPlan> => {
    const res = await fetch(`/api/action-plan/${learnerId}`);
    return res.json();
  },

  toggleMilestone: async (milestoneId: string, completed: boolean): Promise<any> => {
    const res = await fetch(`/api/action-plan/milestone/${milestoneId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    return res.json();
  },

  // Audits & Analytics
  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await fetch('/api/audit/logs');
    return res.json();
  },

  getAnalytics: async (): Promise<SystemAnalytics> => {
    const res = await fetch('/api/analytics/overview');
    return res.json();
  },

  // Notifications
  getNotifications: async (userId: string): Promise<NotificationItem[]> => {
    const res = await fetch(`/api/notifications/${userId}`);
    return res.json();
  },

  markNotificationRead: async (id: string): Promise<any> => {
    const res = await fetch(`/api/notifications/read/${id}`, { method: 'POST' });
    return res.json();
  },

  // Privacy & Consents
  getConsent: async (userId: string): Promise<ConsentSettings> => {
    const res = await fetch(`/api/privacy/consent/${userId}`);
    return res.json();
  },

  updateConsent: async (userId: string, data: Partial<ConsentSettings>): Promise<any> => {
    const res = await fetch(`/api/privacy/consent/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  requestDataDeletion: async (userId: string): Promise<any> => {
    const res = await fetch('/api/privacy/forget-me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },
};
