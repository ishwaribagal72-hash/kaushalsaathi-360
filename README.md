# KAUSHALSAATHI 360 (कौशलसाथी ३६०)

**SIH Project ID:** SIH26241  
**Title:** AI-Enabled Career Counselling and Family Decision-Support Platform for Vocational Education  
**Framework Alignment:** National Skills Qualification Framework (NSQF) & National Council for Vocational Education and Training (NCVET)

---

## 🌟 Executive Summary

Vocational education in India faces a critical social bottleneck: **career decisions are rarely made by the learner alone.** While students may show high mechanical aptitude or passion for green trades (Solar PV, Electrician, EV Mobility, CNC Machining), parental anxiety regarding erratic daily wages, workplace electrical/mechanical hazards, and societal white-collar degree stigma often derails enrollment into ITIs and polytechnics.

**KAUSHALSAATHI 360** is an enterprise-grade, full-stack vocational career counselling and family decision-support portal that bridges this gap. Instead of a generic chatbot, it implements an empirical **Family Consensus Engine™**, an **Evidence Trust Engine™** with strict zero-hallucination abstention guarantees, an interactive **3-Pathway Simulator**, a **Counsellor Triage Desk**, and an immutable **OWASP ASVS Audit Trail**.

---

## 🚀 Key Modules & Capabilities

### 1. Multi-Stakeholder Role-Based Access Control (RBAC)
- **Learner (`usr-learner-01` / Rohan Sharma):**
  - Psychometric & Vocational Aptitude Assessment (Mechanical, Spatial, Digital, Practical, People Care).
  - NSQF Level 1–10 Career Recommendation Dossier.
  - Interactive 3-Pathway Multi-Simulator (Apprenticeship vs Diploma vs Mudra Entrepreneurship).
  - Action Plan Milestone Roadmap with Direct Govt Portal Links (NAPS, DVET).
  - Trilingual AI Voc-Saathi Voice & Chat Assistant (English, Hindi, Marathi).
- **Parent / Guardian (`usr-parent-01` / Suresh Sharma):**
  - Interactive Parent Concern Vector (Salary, Safety, Job Stability, Training Cost, Distance, Social Status).
  - Family Consensus Agreement Meter (0–100%).
  - Conflict Resolution Cards with verified government evidence to alleviate anxieties.
  - Request Human Counsellor Mediation session.
- **Counsellor (`usr-counsellor-01` / Dr. Anjali Deshmukh):**
  - High-risk dropout & family conflict triage queue.
  - Comprehensive student psychometric dossier inspector.
  - Professional Human Override of AI recommendations with documented rationale.
  - Mediation session note recorder and action plan approval.
- **Admin (`usr-admin-01` / Priya Sundaram):**
  - Evidence source verification console (NCVET, PLFS, NAPS, MSDE).
  - AI confidence threshold and human-in-the-loop cutoff calibration.
  - Tamper-evident immutable audit logs with role, actor, action, and IP tracking.
  - Anonymized national and state-level vocational analytics.

---

### 2. Unique Family Consensus Engine™
```
V_learner = [Passion, HandsOnPreference, TechAffinity, WillingnessToRelocate, EntrepreneurialDrive]
V_parent  = [SalaryConcern, SafetyConcern, JobSecurityConcern, CostConcern, DistanceConcern, StatusConcern]

AgreementScore = Clamp(100 - (0.45 * Disparity(Salary, Safety, Stability)), 35, 98)
```
- Automatically identifies conflict areas (e.g. Learner wants Electrician trade; Parent fears daily-wage unorganized wireman risks).
- Retrieves verified government counter-evidence cards from MoSPI PLFS bulletins and NAPS Gazette to resolve concerns with empirical data.
- Generates dinner-table discussion prompts for home round-tables.

---

### 3. Evidence Trust Engine™ (Zero-Hallucination Guardrail)
Every factual claim presented by the platform contains:
- **Publishing Authority:** MSDE, MoSPI, NCVET, DGT, or Sector Skill Councils.
- **Publication Date & Last Verification Date.**
- **Geography:** Pan-India or State Disaggregated.
- **Evidence Quality & Confidence Score:** 0.0 to 1.0.
- **Abstention Guarantee:** If reliable government data does not exist for an emerging sector (e.g. 10-year longitudinal pension for agricultural drone pilots), the engine strictly returns `UNKNOWN: Reliable evidence was not found for this specific claim`.

---

### 4. 3-Pathway Simulator
For any trade (Electrician, Solar PV, EV Specialist, CNC Machinist, Drone Pilot, Healthcare Assistant):
- **Path A: Apprenticeship (NAPS):** Craftsmen ITI → Paid NAPS Apprenticeship (₹8,500 - ₹12,000/mo) → Industry Line Technician.
- **Path B: Higher Technical Diploma (CITS / Polytechnic):** ITI → Lateral Entry to 2nd-Year Polytechnic → Junior Engineer Cadre.
- **Path C: Mudra Entrepreneurship:** Trade License → PMMY Shishu/Kishor Loan (₹50,000 to ₹5,00,000) → Licensed Contracting Business.

---

## 🛠️ Technology Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, Lucide Icons, Web Speech API (STT/TTS).
- **Backend:** Node.js, Express, tsx runtime, Modular Micro-services (`auth_service`, `recommendation_service`, `family_service`, `evidence_service`, `rag_service`, `counsellor_service`, `audit_service`, `analytics_service`).
- **AI & RAG:** Google Gemini 3.8 Flash (`@google/genai`) with Grounded Government RAG & Strict Citation Verification.
- **Database Engine:** PostgreSQL 16 schema (`/schema.sql` with 22 relational tables, constraints, foreign keys, triggers, and indexes).
- **Containerization:** Multi-stage Dockerfile and Docker Compose orchestration (`/docker-compose.yml`).
- **Security & Privacy:** OWASP ASVS Level 2, DPDP Act 2023 Granular Consent Management, Data Portability (Export JSON), Right to be Forgotten workflow.

---

## 🚀 Quickstart & Local Execution

### 1. Direct Execution
```bash
# Clone the repository
git clone https://github.com/kaushalsaathi/kaushalsaathi360.git
cd kaushalsaathi360

# Install dependencies
npm install

# Start development full-stack server
npm run dev
# The server runs on http://localhost:3000
```

### 2. Multi-Container Docker Deployment
```bash
# Launch Web App + PostgreSQL 16 + Redis
docker-compose up --build
```

---

## 📜 Government Compliance & Hackathon Verification
- **Aadhaar Policy:** Does not mandate Aadhaar numbers for exploration, maintaining low barrier to entry and privacy by design.
- **Multilingual Support:** English, Hindi (हिंदी), and Marathi (मराठी) accessible via top language switcher.
- **National Helpline Integration:** Toll-free 14422 Skill India Digital helpline linked in footer.
