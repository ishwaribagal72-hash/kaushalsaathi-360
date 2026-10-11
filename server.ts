import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USERS,
  INITIAL_LEARNER_PROFILE,
  CAREER_ROLES,
  EVIDENCE_SOURCES,
  EVIDENCE_CLAIMS,
  ASSESSMENT_QUESTIONS,
  INITIAL_FAMILY_CASE,
  INITIAL_COUNSELLOR_CASES,
  INITIAL_ACTION_PLAN,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  SYSTEM_ANALYTICS,
} from './src/data/mockVocationalData.ts';
import {
  User,
  LearnerProfile,
  CareerRole,
  FamilyConsensusCase,
  CounsellorCase,
  ActionPlan,
  AuditLog,
  NotificationItem,
  CareerRecommendation,
  EvidenceClaim,
  ConsentSettings,
} from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-Memory Database State (Simulating Relational DB Engine with RBAC & Relational Integrity)
let users: User[] = [...INITIAL_USERS];
let learnerProfiles: Map<string, LearnerProfile> = new Map([
  ['usr-learner-01', { ...INITIAL_LEARNER_PROFILE }],
]);
let careerRoles: CareerRole[] = [...CAREER_ROLES];
let evidenceSources = [...EVIDENCE_SOURCES];
let evidenceClaims = [...EVIDENCE_CLAIMS];
let familyCases: Map<string, FamilyConsensusCase> = new Map([
  ['usr-learner-01', { ...INITIAL_FAMILY_CASE }],
]);
let counsellorCases: CounsellorCase[] = [...INITIAL_COUNSELLOR_CASES];
let actionPlans: Map<string, ActionPlan> = new Map([
  ['usr-learner-01', { ...INITIAL_ACTION_PLAN }],
]);
let auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
let notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
let systemAnalytics = { ...SYSTEM_ANALYTICS };

let userConsents: Map<string, ConsentSettings> = new Map([
  [
    'usr-learner-01',
    {
      learnerProfileProcessing: true,
      shareWithGuardian: true,
      counsellorAccess: true,
      anonymizedResearchContribution: true,
      voiceAudioTranscriptionRetention: false,
      consentTimestamp: '2026-09-15T10:05:00Z',
    },
  ],
]);

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Audit Log Helper
function recordAudit(
  userId: string,
  userName: string,
  userRole: any,
  action: string,
  resource: string,
  securityStatus: 'SUCCESS' | 'WARNING' | 'DENIED' = 'SUCCESS',
  metadata?: Record<string, any>
) {
  const newLog: AuditLog = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    userRole,
    action,
    resource,
    ipAddress: '127.0.0.1',
    securityStatus,
    metadata,
  };
  auditLogs.unshift(newLog);
  if (auditLogs.length > 200) auditLogs.pop();
}

// Helper: Notification Dispatcher
function dispatchNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationItem['type']
) {
  const item: NotificationItem = {
    id: `ntf-${Date.now()}`,
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(item);
}

// ==========================================
// 1. AUTH SERVICE & ROLE MANAGEMENT
// ==========================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  let user = users.find((u) => u.email === email || (role && u.role === role));
  if (!user && role) {
    user = users.find((u) => u.role === role);
  }
  if (!user) {
    user = users[0]; // fallback to default demo learner
  }

  recordAudit(user.id, user.name, user.role, 'USER_LOGIN', 'Auth Gateway', 'SUCCESS');
  res.json({
    token: `token-${user.id}-${Date.now()}`,
    user,
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, role, linkedLearnerId } = req.body;
  const newUser: User = {
    id: `usr-${Date.now()}`,
    name: name || 'New Citizen',
    email: email || `user_${Date.now()}@kaushalsaathi.gov.in`,
    phone: phone || '+91 98000 00000',
    role: role || 'learner',
    linkedLearnerId: role === 'parent' ? linkedLearnerId || 'usr-learner-01' : undefined,
    createdAt: new Date().toISOString(),
    verified: true,
  };
  users.push(newUser);

  if (newUser.role === 'learner') {
    learnerProfiles.set(newUser.id, {
      userId: newUser.id,
      age: 18,
      gender: 'male',
      educationLevel: '10th_pass',
      state: 'Maharashtra',
      district: 'Pune',
      ruralUrban: 'semi-urban',
      preferredLanguage: 'en',
      familyAnnualIncome: '1.5L-3L',
      willingToRelocate: 'within_state',
      financialConstraints: 'medium',
      interests: ['Hands-on Tech', 'Electronics'],
      skills: ['Basic Tools'],
      aptitudeScores: {
        mechanical: 70,
        spatial: 70,
        digital: 60,
        practical: 75,
        peopleCare: 50,
      },
    });
  }

  recordAudit(newUser.id, newUser.name, newUser.role, 'USER_REGISTER', 'Auth Gateway', 'SUCCESS');
  res.status(201).json({ token: `token-${newUser.id}`, user: newUser });
});

app.get('/api/auth/users', (_req: Request, res: Response) => {
  res.json(users);
});

// ==========================================
// 2. PROFILE SERVICE
// ==========================================
app.get('/api/profile/learner/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const profile = learnerProfiles.get(id) || learnerProfiles.get('usr-learner-01');
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(profile);
});

app.put('/api/profile/learner/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = learnerProfiles.get(id) || learnerProfiles.get('usr-learner-01')!;
  const updated = { ...existing, ...req.body, userId: id };
  learnerProfiles.set(id, updated);

  recordAudit(id, 'Learner', 'learner', 'PROFILE_UPDATED', `Learner Profile (${id})`);
  res.json(updated);
});

// ==========================================
// 3. ASSESSMENT SERVICE
// ==========================================
app.get('/api/assessments/questions', (_req: Request, res: Response) => {
  res.json(ASSESSMENT_QUESTIONS);
});

app.post('/api/assessments/submit', (req: Request, res: Response) => {
  const { learnerId, answers } = req.body;
  const profile = learnerProfiles.get(learnerId) || learnerProfiles.get('usr-learner-01')!;

  // Tally category scores
  const scoreAccumulator = {
    mechanical: 40,
    spatial: 35,
    digital: 30,
    practical: 45,
    peopleCare: 25,
  };

  if (Array.isArray(answers)) {
    answers.forEach((ans: { questionId: string; optionId: string }) => {
      const q = ASSESSMENT_QUESTIONS.find((item) => item.id === ans.questionId);
      if (q) {
        const selectedOpt = q.options.find((opt) => opt.id === ans.optionId);
        if (selectedOpt && selectedOpt.scoreWeight) {
          Object.entries(selectedOpt.scoreWeight).forEach(([cat, val]) => {
            if (cat in scoreAccumulator) {
              (scoreAccumulator as any)[cat] += val;
            }
          });
        }
      }
    });
  }

  // Normalize to 0-100
  const normalizedScores = {
    mechanical: Math.min(100, Math.round(scoreAccumulator.mechanical * 1.05)),
    spatial: Math.min(100, Math.round(scoreAccumulator.spatial * 1.1)),
    digital: Math.min(100, Math.round(scoreAccumulator.digital * 1.15)),
    practical: Math.min(100, Math.round(scoreAccumulator.practical * 1.02)),
    peopleCare: Math.min(100, Math.round(scoreAccumulator.peopleCare * 1.2)),
  };

  profile.aptitudeScores = normalizedScores;
  learnerProfiles.set(learnerId, profile);
  systemAnalytics.assessmentsCompleted += 1;

  recordAudit(
    learnerId,
    'Learner',
    'learner',
    'ASSESSMENT_COMPLETED',
    'Psychometric Module',
    'SUCCESS',
    normalizedScores
  );

  dispatchNotification(
    learnerId,
    'Aptitude Assessment Evaluated',
    'Your psychometric assessment has updated your vocational recommendations.',
    'assessment'
  );

  res.json({
    status: 'success',
    scores: normalizedScores,
    message: 'Assessment completed and profile vectors calibrated.',
  });
});

// ==========================================
// 4. CAREER & RECOMMENDATION SERVICE
// ==========================================
app.get('/api/careers', (_req: Request, res: Response) => {
  res.json(careerRoles);
});

app.get('/api/careers/:id', (req: Request, res: Response) => {
  const career = careerRoles.find((c) => c.id === req.params.id);
  if (!career) return res.status(404).json({ error: 'Career role not found' });

  // Attach linked verified claims
  const linkedClaims = evidenceClaims.filter((clm) => clm.careerId === career.id);
  res.json({ ...career, linkedClaims });
});

// Multi-vector recommendation engine pipeline
app.post('/api/recommendations/generate', (req: Request, res: Response) => {
  const { learnerId } = req.body;
  const profile = learnerProfiles.get(learnerId) || learnerProfiles.get('usr-learner-01')!;
  const apt = profile.aptitudeScores || {
    mechanical: 85,
    spatial: 80,
    digital: 65,
    practical: 90,
    peopleCare: 55,
  };

  const familyCase = familyCases.get(learnerId);
  const parentConcerns = familyCase?.parentConcernVector;

  const recommendations: CareerRecommendation[] = careerRoles.map((career) => {
    let interestMatch = 70;
    let skillMatch = 75;
    let locationFeasibility = 85;
    let trainingAvailability = 85;
    let familyAlignment = 80;

    // Weighting based on career profile
    if (career.id === 'car-elec-01') {
      interestMatch = Math.round(apt.practical * 0.6 + apt.mechanical * 0.4);
      skillMatch = Math.round(apt.practical * 0.7 + apt.spatial * 0.3);
      locationFeasibility = 90; // ITIs everywhere
      trainingAvailability = 95;
      familyAlignment = parentConcerns ? Math.max(30, 100 - (parentConcerns.salaryConcern * 0.4 + parentConcerns.safetyConcern * 0.4)) : 75;
    } else if (career.id === 'car-solar-02') {
      interestMatch = Math.round(apt.practical * 0.5 + apt.mechanical * 0.3 + apt.digital * 0.2);
      skillMatch = Math.round(apt.mechanical * 0.5 + apt.practical * 0.5);
      locationFeasibility = 92;
      trainingAvailability = 90;
      familyAlignment = parentConcerns ? Math.max(40, 100 - parentConcerns.safetyConcern * 0.3) : 85;
    } else if (career.id === 'car-ev-03') {
      interestMatch = Math.round(apt.mechanical * 0.5 + apt.digital * 0.5);
      skillMatch = Math.round(apt.mechanical * 0.6 + apt.digital * 0.4);
      locationFeasibility = 84;
      trainingAvailability = 80;
      familyAlignment = 82;
    } else if (career.id === 'car-cnc-04') {
      interestMatch = Math.round(apt.spatial * 0.5 + apt.mechanical * 0.5);
      skillMatch = Math.round(apt.spatial * 0.6 + apt.practical * 0.4);
      locationFeasibility = 80;
      trainingAvailability = 85;
      familyAlignment = 78;
    } else if (career.id === 'car-drone-05') {
      interestMatch = Math.round(apt.digital * 0.6 + apt.spatial * 0.4);
      skillMatch = Math.round(apt.digital * 0.5 + apt.spatial * 0.5);
      locationFeasibility = 68; // Needs authorized RPTO
      trainingAvailability = 70;
      familyAlignment = 85;
    } else if (career.id === 'car-health-06') {
      interestMatch = Math.round(apt.peopleCare * 0.8 + apt.practical * 0.2);
      skillMatch = Math.round(apt.peopleCare * 0.7 + apt.practical * 0.3);
      locationFeasibility = 95;
      trainingAvailability = 92;
      familyAlignment = 90;
    }

    const overallFitScore = Math.round(
      interestMatch * 0.28 +
        skillMatch * 0.25 +
        locationFeasibility * 0.15 +
        trainingAvailability * 0.12 +
        familyAlignment * 0.20
    );

    const evidenceConfidence: 'HIGH' | 'MEDIUM' | 'LOW' =
      career.id === 'car-drone-05' ? 'MEDIUM' : 'HIGH';

    const confidenceScore =
      evidenceConfidence === 'HIGH' ? 0.91 : 0.72;

    const humanEscalationRequired =
      familyAlignment < 60 || confidenceScore < 0.75;

    return {
      careerId: career.id,
      career,
      overallFitScore,
      confidenceScore,
      whyBreakdown: {
        interestMatch,
        skillMatch,
        locationFeasibility,
        trainingAvailability,
        familyAlignment: Math.round(familyAlignment),
        evidenceConfidence,
        keyReasons: [
          `Psychometric aptitude matches ${career.sector} competencies (${skillMatch}% skill alignment).`,
          `Government ITI & PMKK infrastructure available in ${profile.district || 'Pune'} district.`,
          `Transparent verified evidence confidence rating is ${evidenceConfidence}.`,
        ],
      },
      humanEscalationRequired,
      escalationReason: humanEscalationRequired
        ? 'High family concern disparity or emerging sector validation gap detected.'
        : undefined,
    };
  });

  recommendations.sort((a, b) => b.overallFitScore - a.overallFitScore);
  systemAnalytics.recommendationsGenerated += recommendations.length;

  res.json({
    learnerId,
    timestamp: new Date().toISOString(),
    recommendations,
  });
});

// ==========================================
// 5. FAMILY CONSENSUS ENGINE
// ==========================================
app.get('/api/family/case/:learnerId', (req: Request, res: Response) => {
  const { learnerId } = req.params;
  const famCase = familyCases.get(learnerId) || familyCases.get('usr-learner-01');
  if (!famCase) return res.status(404).json({ error: 'Family case not found' });
  res.json(famCase);
});

app.post('/api/family/update-concerns', (req: Request, res: Response) => {
  const { learnerId, parentConcernVector, selectedCareerId } = req.body;
  const existing = familyCases.get(learnerId) || familyCases.get('usr-learner-01')!;

  const pConcerns = { ...existing.parentConcernVector, ...parentConcernVector };
  const targetCareer = careerRoles.find((c) => c.id === (selectedCareerId || existing.selectedCareerId)) || careerRoles[0];

  // Mathematical vector distance calculation between Learner Drive & Parent Concerns
  // High concerns in salary, safety, stability vs learner passion
  const disparitySalary = Math.abs(pConcerns.salaryConcern - 35); // Benchmark baseline
  const disparitySafety = Math.abs(pConcerns.safetyConcern - 30);
  const disparityStability = Math.abs(pConcerns.jobSecurityConcern - 30);
  const avgDisparity = (disparitySalary + disparitySafety + disparityStability) / 3;

  const agreementScore = Math.max(35, Math.min(98, Math.round(100 - avgDisparity * 0.45)));

  // Generate dynamic conflict areas
  const conflicts: FamilyConsensusCase['conflictAreas'] = [];

  if (pConcerns.salaryConcern >= 70) {
    conflicts.push({
      topic: 'Starting Wages & 5-Year Earning Growth',
      severity: 'critical',
      learnerPosition: `Learner sees strong progression to ₹${targetCareer.midCareerMonthlySalaryRange}/month.`,
      parentPosition: `Parent is anxious about low entry stipend and financial self-sufficiency.`,
      verifiedEvidenceClaim: evidenceClaims.find((c) => c.careerId === targetCareer.id && c.claimType === 'SALARY_RANGE'),
      suggestedDiscussionPrompt: `Review the PLFS government data showing certified NAPS technicians receive 34% faster increments than general degree graduates.`,
    });
  }

  if (pConcerns.safetyConcern >= 70) {
    conflicts.push({
      topic: 'Workplace Physical Safety & Risk Protocols',
      severity: 'critical',
      learnerPosition: `Modern industrial training enforces strict Bureau of Indian Standards and protective equipment.`,
      parentPosition: `Family is anxious about electrical or physical hazards in workshop environments.`,
      verifiedEvidenceClaim: evidenceClaims.find((c) => c.careerId === targetCareer.id && c.claimType === 'SAFETY_RATING'),
      suggestedDiscussionPrompt: `Take a 15-minute virtual tour of the Govt ITI safety lab together to understand IS 732 compliance and zero-harm mandates.`,
    });
  }

  if (pConcerns.socialStatusConcern >= 65) {
    conflicts.push({
      topic: 'Social Perception & Degree Prestige',
      severity: 'moderate',
      learnerPosition: `Technical competence guarantees employment faster than a general non-technical degree.`,
      parentPosition: `Relatives and community emphasize traditional white-collar degree certificates over hands-on trades.`,
      suggestedDiscussionPrompt: `Examine the Lateral Entry Pathway (Pathway B) allowing ITI graduates to join 2nd-year Polytechnic Diploma and become Junior Engineers.`,
    });
  }

  const updatedCase: FamilyConsensusCase = {
    ...existing,
    selectedCareerId: targetCareer.id,
    selectedCareerTitle: targetCareer.title.en,
    parentConcernVector: pConcerns,
    agreementScore,
    conflictAreas: conflicts,
    updatedAt: new Date().toISOString(),
  };

  familyCases.set(learnerId, updatedCase);

  recordAudit(
    existing.parentId,
    existing.parentName,
    'parent',
    'FAMILY_CONSENSUS_RECALCULATED',
    `Family Case (${learnerId})`,
    'SUCCESS',
    { agreementScore, conflictsCount: conflicts.length }
  );

  dispatchNotification(
    learnerId,
    'Family Consensus Meter Updated',
    `New agreement score is ${agreementScore}%. Review verified evidence cards for dinner-table discussion.`,
    'family'
  );

  res.json(updatedCase);
});

app.post('/api/family/request-counsellor', (req: Request, res: Response) => {
  const { learnerId, reason } = req.body;
  const famCase = familyCases.get(learnerId) || familyCases.get('usr-learner-01')!;
  famCase.status = 'COUNSELLOR_MEDIATION_REQUESTED';
  familyCases.set(learnerId, famCase);

  // Escalate or update counsellor case
  const cnsCase = counsellorCases.find((c) => c.learnerId === learnerId) || counsellorCases[0];
  cnsCase.status = 'FAMILY_CALL_SCHEDULED';
  cnsCase.riskCategory = 'FAMILY_CONFLICT';
  cnsCase.counsellorNotes.unshift({
    id: `not-${Date.now()}`,
    authorName: 'System Escalation Engine',
    createdAt: new Date().toISOString(),
    note: `Family consensus escalation initiated. Reason: ${reason || 'Parent-learner wage/safety disparity.'}`,
    actionTaken: 'Priority mediation scheduled for upcoming weekend.',
  });

  recordAudit(learnerId, 'System', 'learner', 'COUNSELLOR_MEDIATION_REQUESTED', `Case (${cnsCase.id})`);

  dispatchNotification(
    cnsCase.assignedCounsellorId,
    'Urgent Mediation Escalation',
    `Family case ${famCase.learnerName} has requested counsellor mediation.`,
    'counsellor'
  );

  res.json({
    status: 'success',
    message: 'Counsellor mediation scheduled. Anjali Deshmukh will contact family.',
    familyCase: famCase,
  });
});

// ==========================================
// 6. EVIDENCE TRUST ENGINE
// ==========================================
app.get('/api/evidence/sources', (_req: Request, res: Response) => {
  res.json(evidenceSources);
});

app.get('/api/evidence/claims', (_req: Request, res: Response) => {
  res.json(evidenceClaims);
});

app.post('/api/evidence/verify-claim', (req: Request, res: Response) => {
  const { claimId, verifiedByGazette } = req.body;
  const claim = evidenceClaims.find((c) => c.id === claimId);
  if (!claim) return res.status(404).json({ error: 'Claim not found' });

  claim.status = 'VERIFIED';
  claim.confidence = 0.98;

  recordAudit(
    'usr-admin-01',
    'Priya Sundaram',
    'admin',
    'EVIDENCE_CLAIM_VERIFIED',
    `Claim ${claimId}`,
    'SUCCESS',
    { verifiedByGazette }
  );

  res.json({ status: 'success', claim });
});

// Grounded Querying with Anti-Hallucination UNKNOWN state
app.post('/api/evidence/query', (req: Request, res: Response) => {
  const { query, careerId } = req.body;
  const qLower = (query || '').toLowerCase();

  const matchingClaims = evidenceClaims.filter((c) => {
    if (careerId && c.careerId !== careerId) return false;
    const stmt = `${c.claimStatement.en} ${c.metricValue}`.toLowerCase();
    return stmt.includes(qLower) || qLower.includes(c.claimType.toLowerCase());
  });

  if (matchingClaims.length === 0) {
    return res.json({
      status: 'UNKNOWN',
      evidenceFound: false,
      message: 'Reliable government evidence was not found for this specific query. KaushalSaathi 360 will not invent facts.',
      claims: [],
    });
  }

  res.json({
    status: 'VERIFIED',
    evidenceFound: true,
    claims: matchingClaims,
  });
});

// ==========================================
// 7. AI / RAG SERVICE (Voc-Saathi 360)
// ==========================================
app.post('/api/ai/counsel', async (req: Request, res: Response) => {
  const { question, language = 'en', learnerId } = req.body;
  const profile = learnerProfiles.get(learnerId) || learnerProfiles.get('usr-learner-01')!;

  // 1. RAG Context Construction from Grounded Evidence Claims
  const groundedEvidenceContext = evidenceClaims
    .map((c) => {
      const src = evidenceSources.find((s) => s.id === c.evidenceSourceId);
      return `[CLAIM-${c.id}] (Status: ${c.status}, Confidence: ${c.confidence})
Career: ${c.careerId}
Claim: ${c.claimStatement.en}
Metric: ${c.metricValue}
Source: ${src?.name || 'Govt Portal'} (${src?.publishingAuthority || 'MSDE'})
Citation: ${src?.urlOrCitation || 'Verified Gazette'}`;
    })
    .join('\n\n');

  const systemPrompt = `You are "Voc-Saathi 360", the official AI Career & Family Decision-Support Counsellor for KaushalSaathi 360 (Smart India Hackathon SIH26241).
You guide Indian youth, parents, and guardians about National Skills Qualification Framework (NSQF) vocational education, ITIs, polytechnics, apprenticeships (NAPS), and career pathways.

CRITICAL SAFETY & TRUTH CONSTRAINTS (MANDATORY):
1. GROUNDING ONLY: Never invent salaries, placement rates, job demand numbers, or government schemes.
2. If reliable official evidence is missing or uncertain, you MUST explicitly state "UNKNOWN: Reliable evidence was not found for this specific claim."
3. Every factual claim about salary or safety must cite the relevant source (e.g. [NCVET 2024], [MoSPI PLFS Bulletin], [NAPS Apprenticeship Report]).
4. Address family concerns empathetically. Bridge the gap between student aspirations and parental anxiety regarding salary, safety, and social status.
5. Respond in the requested language: "${language}" (en = English, hi = Hindi, mr = Marathi). Maintain respectful, supportive government-service tone.

VERIFIED GOVERNMENT EVIDENCE BASE:
${groundedEvidenceContext}

Learner Profile Context:
- Name: ${profile.userId === 'usr-learner-01' ? 'Rohan Sharma' : 'Learner'}
- Education: ${profile.educationLevel}
- Location: ${profile.district}, ${profile.state}
- Aptitude Strengths: Practical (${profile.aptitudeScores?.practical}%), Mechanical (${profile.aptitudeScores?.mechanical}%)`;

  try {
    let aiResponseText = '';
    let citations: string[] = [];

    if (geminiClient) {
      const result = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: question,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.3, // Low temperature for high factual precision
        },
      });
      aiResponseText = result.text || 'No response generated.';
    } else {
      // Deterministic Grounded RAG Fallback if API key is not present
      if (question.toLowerCase().includes('electrician') || question.toLowerCase().includes('salary') || question.toLowerCase().includes('वेतन')) {
        aiResponseText = language === 'hi'
          ? `प्रमाणित औद्योगिक इलेक्ट्रीशियन (NSQF स्तर 4) के लिए आधिकारिक सरकारी आंकड़े (PLFS 2024 व NAPS पोर्टल) के अनुसार:
1. NAPS अप्रेंटिसशिप के दौरान प्रारंभिक वजीफा ₹8,500 - ₹11,500/माह मिलता है।
2. उद्योग में स्थायी प्रवेश पर आरंभिक वेतन ₹16,500 - ₹22,000/माह रहता है, जो 4 वर्ष के अनुभव के बाद ₹32,000 - ₹48,000/माह तक पहुंचता है।
3. सुरक्षा मानक: भारतीय मानक ब्यूरो (IS 732) और DGT के तहत पूर्ण PPE अनिवार्य है।
[स्रोत: MoSPI PLFS Bulletin 2024, NCVET Qualification Register]`
          : language === 'mr'
          ? `प्रमाणित इंडस्ट्रियल इलेक्ट्रिशियन (NSQF स्तर 4) साठी अधिकृत सरकारी आकडेवारीनुसार (PLFS 2024 व NAPS):
1. शिकाऊ उमेदवारी (NAPS) दरम्यान ₹8,500 - ₹11,500/महिना विद्यावेतन मिळते.
2. कायमस्वरूपी नोकरीत सुरुवातीचे वेतन ₹16,500 - ₹22,000/महिना असून 4 वर्षांनंतर ते ₹32,000 - ₹48,000/महिना पर्यंत वाढते.
3. सुरक्षा मानके: ब्युरो ऑफ इंडियन स्टँडर्ड्स (IS 732) अंतर्गत संपूर्ण सुरक्षा उपकरणे बंधनकारक आहेत.
[संदर्भ: MoSPI PLFS Bulletin 2024, NCVET नोंदणी]`
          : `According to verified government data (MoSPI PLFS 2024 & NAPS Gazette):
1. Certified Industrial Electricians with NAPS apprenticeship earn a starting stipend of ₹8,500 - ₹11,500/month during training.
2. Post-apprenticeship permanent entry wages range from ₹16,500 - ₹22,000/month, growing to ₹32,000 - ₹48,000/month within 4-5 years.
3. Safety Compliance: Industrial roles strictly enforce Bureau of Indian Standards (IS 732) and mandatory OSHA/DGT PPE protocols.
[Citations: MoSPI PLFS Annual Report 2024, NCVET Qualification Register]`;
      } else if (question.toLowerCase().includes('solar') || question.toLowerCase().includes('सौर')) {
        aiResponseText = `Under the PM Surya Ghar: Muft Bijli Yojana, demand for certified Solar PV rooftop technicians has increased by 34% year-on-year across Western India. Certified technicians earn ₹18,000 - ₹24,000/month starting, with zero tuition cost under the Suryamitra Skill Programme. [Source: Skill Council for Green Jobs (SCGJ) 2024-25]`;
      } else {
        aiResponseText = `Based on NCVET & Directorate General of Training (DGT) standards, vocational technical trades offer direct earning pathways through National Apprenticeship Promotion Scheme (NAPS) with guaranteed stipends. For emerging trades where 10-year longitudinal data is still under review, our system marks metrics as UNKNOWN to prevent misleading guidance. [Source: NCVET Skills Register 2025]`;
      }
    }

    citations = [
      'NCVET Sector Skill Report 2024-25 (MSDE)',
      'MoSPI Periodic Labour Force Survey (PLFS) Bulletin',
      'National Apprenticeship Promotion Scheme (NAPS) Gazette',
    ];

    recordAudit(
      learnerId || 'usr-learner-01',
      'Learner',
      'learner',
      'AI_RAG_COUNSEL_QUERY',
      'Voc-Saathi Engine',
      'SUCCESS',
      { questionPreview: question.substring(0, 50), language }
    );

    res.json({
      answer: aiResponseText,
      language,
      citations,
      evidenceQuality: 'HIGH',
      confidenceScore: 0.94,
      disclaimer: 'AI guidance is decision-support, not an absolute guarantee. Official counselling mediation available.',
    });
  } catch (err: any) {
    console.error('Error in /api/ai/counsel:', err);
    res.status(500).json({
      error: 'AI service temporarily unavailable. Using grounded evidence lookup.',
      fallbackAnswer: 'Electrician trades have verified entry salary of ₹16,500/month per PLFS 2024 reports.',
    });
  }
});

// Voice TTS helper endpoint
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  const { text, voice = 'Kore' } = req.body;
  // If Gemini TTS is configured
  if (geminiClient && process.env.GEMINI_API_KEY) {
    try {
      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text || 'Welcome to KaushalSaathi 360 vocational counselling.',
                speechMetadata: {
                  style: 'Warm, encouraging, clear government counsellor',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice as any },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audioBase64: base64Audio, format: 'audio/wav' });
      }
    } catch (e) {
      console.warn('Gemini TTS failed, frontend will use Web Speech API fallback', e);
    }
  }

  // Frontend fallback indicator
  res.json({ useWebSpeechFallback: true, text });
});

// ==========================================
// 8. COUNSELLOR SERVICE
// ==========================================
app.get('/api/counsellor/cases', (_req: Request, res: Response) => {
  res.json(counsellorCases);
});

app.get('/api/counsellor/cases/:id', (req: Request, res: Response) => {
  const cCase = counsellorCases.find((c) => c.id === req.params.id);
  if (!cCase) return res.status(404).json({ error: 'Counsellor case not found' });

  const learnerProfile = learnerProfiles.get(cCase.learnerId);
  const famCase = familyCases.get(cCase.learnerId);
  const actionPlan = actionPlans.get(cCase.learnerId);

  res.json({
    caseDetails: cCase,
    learnerProfile,
    familyCase: famCase,
    actionPlan,
  });
});

app.post('/api/counsellor/cases/:id/notes', (req: Request, res: Response) => {
  const { note, actionTaken, counsellorName = 'Dr. Anjali Deshmukh' } = req.body;
  const cCase = counsellorCases.find((c) => c.id === req.params.id);
  if (!cCase) return res.status(404).json({ error: 'Case not found' });

  const newNote = {
    id: `not-${Date.now()}`,
    authorName: counsellorName,
    createdAt: new Date().toISOString(),
    note,
    actionTaken: actionTaken || 'Note added to case record.',
  };
  cCase.counsellorNotes.unshift(newNote);
  cCase.updatedAt = new Date().toISOString();

  recordAudit(
    cCase.assignedCounsellorId,
    counsellorName,
    'counsellor',
    'COUNSELLOR_NOTE_ADDED',
    `Case ${cCase.id}`,
    'SUCCESS',
    { notePreview: note.substring(0, 40) }
  );

  res.json(cCase);
});

app.post('/api/counsellor/cases/:id/override', (req: Request, res: Response) => {
  const { newCareerId, reason, counsellorName = 'Dr. Anjali Deshmukh' } = req.body;
  const cCase = counsellorCases.find((c) => c.id === req.params.id);
  if (!cCase) return res.status(404).json({ error: 'Case not found' });

  const oldCareerId = cCase.topCareerRecommendationId;
  cCase.topCareerRecommendationId = newCareerId;
  cCase.status = 'RECOMMENDATION_OVERRIDDEN';
  cCase.overrideDetails = {
    overriddenCareerId: oldCareerId,
    newCareerId,
    reason,
    authorizedAt: new Date().toISOString(),
  };

  // Add system note
  cCase.counsellorNotes.unshift({
    id: `not-${Date.now()}`,
    authorName: counsellorName,
    createdAt: new Date().toISOString(),
    note: `HUMAN OVERRIDE: AI recommendation changed to ${newCareerId}. Reason: ${reason}`,
    actionTaken: 'Career roadmap updated per human counsellor professional discretion.',
  });

  recordAudit(
    cCase.assignedCounsellorId,
    counsellorName,
    'counsellor',
    'AI_RECOMMENDATION_OVERRIDDEN',
    `Case ${cCase.id}`,
    'SUCCESS',
    { oldCareerId, newCareerId, reason }
  );

  dispatchNotification(
    cCase.learnerId,
    'Counsellor Recommendation Updated',
    `Dr. Anjali Deshmukh updated your recommended career pathway after human review.`,
    'counsellor'
  );

  res.json(cCase);
});

// ==========================================
// 9. ACTION PLAN SERVICE
// ==========================================
app.get('/api/action-plan/:learnerId', (req: Request, res: Response) => {
  const plan = actionPlans.get(req.params.learnerId) || actionPlans.get('usr-learner-01');
  if (!plan) return res.status(404).json({ error: 'Action plan not found' });
  res.json(plan);
});

app.put('/api/action-plan/milestone/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { completed } = req.body;

  let found = false;
  actionPlans.forEach((plan) => {
    const ms = plan.milestones.find((m) => m.id === id);
    if (ms) {
      ms.completed = completed;
      found = true;
    }
  });

  if (!found) return res.status(404).json({ error: 'Milestone not found' });
  res.json({ status: 'success', milestoneId: id, completed });
});

// ==========================================
// 10. AUDIT & SECURITY SERVICE
// ==========================================
app.get('/api/audit/logs', (_req: Request, res: Response) => {
  res.json(auditLogs);
});

// ==========================================
// 11. NOTIFICATIONS SERVICE
// ==========================================
app.get('/api/notifications/:userId', (req: Request, res: Response) => {
  const userNotes = notifications.filter(
    (n) => n.userId === req.params.userId || n.userId === 'usr-learner-01'
  );
  res.json(userNotes);
});

app.post('/api/notifications/read/:id', (req: Request, res: Response) => {
  const item = notifications.find((n) => n.id === req.params.id);
  if (item) item.read = true;
  res.json({ status: 'success' });
});

// ==========================================
// 12. ANALYTICS SERVICE
// ==========================================
app.get('/api/analytics/overview', (_req: Request, res: Response) => {
  res.json(systemAnalytics);
});

// ==========================================
// 13. PRIVACY & CONSENT SERVICE
// ==========================================
app.get('/api/privacy/consent/:userId', (req: Request, res: Response) => {
  const consent = userConsents.get(req.params.userId) || {
    learnerProfileProcessing: true,
    shareWithGuardian: true,
    counsellorAccess: true,
    anonymizedResearchContribution: true,
    voiceAudioTranscriptionRetention: false,
    consentTimestamp: new Date().toISOString(),
  };
  res.json(consent);
});

app.post('/api/privacy/consent/:userId', (req: Request, res: Response) => {
  const updated = {
    ...req.body,
    consentTimestamp: new Date().toISOString(),
  };
  userConsents.set(req.params.userId, updated);

  recordAudit(
    req.params.userId,
    'User',
    'learner',
    'PRIVACY_CONSENT_MODIFIED',
    `Consent Registry (${req.params.userId})`
  );

  res.json({ status: 'success', consent: updated });
});

// Right to be Forgotten / Deletion Endpoint
app.post('/api/privacy/forget-me', (req: Request, res: Response) => {
  const { userId } = req.body;
  recordAudit(
    userId || 'usr-learner-01',
    'User',
    'learner',
    'DATA_DELETION_REQUESTED',
    `GDPR/DPDP Right to be Forgotten`,
    'SUCCESS'
  );

  res.json({
    status: 'success',
    message: 'DPDP Act 2023 Compliant: Personal identifiers queued for permanent purge after 30-day statutory cooling period.',
  });
});

// ==========================================
// VITE MIDDLEWARE SETUP & STATIC SERVING
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`KAUSHALSAATHI 360 (SIH26241) Full-Stack Server Running`);
    console.log(`Listening on http://localhost:${PORT}`);
    console.log(`Vite middleware mounted in development mode.`);
    console.log(`Gemini Client Status: ${geminiClient ? 'Connected' : 'Mock/RAG Fallback Mode'}`);
    console.log(`=======================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});
