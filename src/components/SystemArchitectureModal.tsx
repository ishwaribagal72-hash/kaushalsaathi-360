import React, { useState } from 'react';
import {
  X,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  Terminal,
  FileText,
  Boxes,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'consensus' | 'security' | 'docker'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  KAUSHALSAATHI 360 | Technical Architecture & System Specs
                </h3>
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  SIH26241
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Smart India Hackathon Production Architecture Dossier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 px-6 py-2.5 flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'architecture', label: 'End-to-End System Flow', icon: Layers },
            { id: 'database', label: 'PostgreSQL Relational ERD', icon: Database },
            { id: 'consensus', label: 'Consensus & Recommendation Engine', icon: Cpu },
            { id: 'security', label: 'Security & OWASP ASVS', icon: ShieldCheck },
            { id: 'docker', label: 'Deployment & Docker Compose', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 text-slate-800">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  1. High-Level Multi-Tier Architecture
                </h4>
                <p className="text-xs text-slate-600">
                  KaushalSaathi 360 separates concern into clean presentation, API gateway, 12 business services, and database persistence layers.
                </p>
              </div>

              {/* Architecture Diagram Representation */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-[11px] font-bold text-blue-900">PRESENTATION LAYER</p>
                    <p className="text-[10px] text-blue-700 mt-1">
                      React 19 + TypeScript + Tailwind 4
                    </p>
                    <div className="text-[9px] text-slate-500 mt-2 space-y-0.5">
                      <div>Learner Dashboard & Simulator</div>
                      <div>Family Consensus Meter</div>
                      <div>Counsellor Triage & Overrides</div>
                      <div>Admin Governance & Audit</div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-lg">
                    <p className="text-[11px] font-bold text-indigo-900">API GATEWAY & AUTH</p>
                    <p className="text-[10px] text-indigo-700 mt-1">
                      Express + OWASP ASVS Middleware
                    </p>
                    <div className="text-[9px] text-slate-500 mt-2 space-y-0.5">
                      <div>JWT / RBAC Enforcement</div>
                      <div>Rate Limiting & Lockout</div>
                      <div>Input Sanitization & XSS</div>
                      <div>Immutable Audit Logging</div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <p className="text-[11px] font-bold text-amber-900">12 CORE SERVICES</p>
                    <p className="text-[10px] text-amber-700 mt-1">
                      Node.js / Express Micro-modules
                    </p>
                    <div className="text-[9px] text-slate-500 mt-2 space-y-0.5">
                      <div>Recommendation Engine</div>
                      <div>Family Consensus Engine</div>
                      <div>Evidence Trust Engine</div>
                      <div>Grounded Gemini RAG</div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <p className="text-[11px] font-bold text-emerald-900">DATA PERSISTENCE</p>
                    <p className="text-[10px] text-emerald-700 mt-1">
                      PostgreSQL 16 + Redis Cache
                    </p>
                    <div className="text-[9px] text-slate-500 mt-2 space-y-0.5">
                      <div>22 Relational Tables</div>
                      <div>NCVET/PLFS Evidence Claims</div>
                      <div>Vector Preferences & Audits</div>
                      <div>DPDP Consent Registry</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-300 rounded-lg text-xs font-mono">
                  <div className="text-orange-400 font-bold mb-1">// RAG Pipeline & Zero-Hallucination Flow</div>
                  <div>User Question → Intent Detector → Query Rewriter → Evidence Retriever (PLFS/NCVET/NAPS) → Reranker → Context Assembly → LLM (Gemini 3.8 Flash) → Citation Verification → Grounded Response or Strict UNKNOWN</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  2. PostgreSQL Relational Entity-Relationship Diagram (ERD)
                </h4>
                <p className="text-xs text-slate-600">
                  Full production schema defined in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">/schema.sql</code>. Complete foreign keys, cascading rules, and composite indexes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {[
                  { table: 'users', role: 'RBAC identity table with role_id, phone, status, and linked_learner_id foreign key.' },
                  { table: 'profiles', role: 'Learner education level, state, district, rural/urban, and aptitude scores.' },
                  { table: 'career_roles', role: 'NCVET aligned career definitions, NSQF levels 1-10, salaries, and safety scores.' },
                  { table: 'career_pathways', role: '3 pathway models: Apprenticeship (NAPS), Diploma (CITS), Entrepreneurship (Mudra).' },
                  { table: 'evidence_sources', role: 'Government publishing authorities (MSDE, MoSPI, NCVET, DGT) with publication dates.' },
                  { table: 'evidence_claims', role: 'Verified salary/safety metrics, confidence score, and explicit UNKNOWN flags.' },
                  { table: 'family_cases', role: 'Learner preference vector vs Parent concern vector and agreement score.' },
                  { table: 'family_concerns', role: 'Individual parent concerns (Salary, Safety, Job Security, Cost, Distance, Status).' },
                  { table: 'counsellor_cases', role: 'Triage state, risk tags, human overrides of AI recommendations, notes.' },
                  { table: 'action_plans', role: 'Action plan milestones, deadlines, portal links, and dual-parent approvals.' },
                  { table: 'consents', role: 'Granular DPDP Act 2023 consent settings with timestamped revocations.' },
                  { table: 'audit_logs', role: 'Tamper-evident system activity log with IP, role, resource, and security status.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900 text-xs mb-1">
                      <Database className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.table}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'consensus' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  3. Unique Family Consensus Engine & Recommendation Pipeline
                </h4>
                <p className="text-xs text-slate-600">
                  How KaushalSaathi 360 reconciles student vocational aspirations with parental traditional anxieties.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900 mb-1">Mathematical Vector Matching Algorithm</div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    Let <strong>V<sub>learner</sub></strong> = [Passion, Mobility, TechAffinity, HandsOn, Independence] and <br />
                    <strong>V<sub>parent</sub></strong> = [SalaryConcern, SafetyConcern, StabilityConcern, CostConcern, DistanceConcern, StatusConcern].<br />
                    The system computes normalized Euclidean disparity across critical axes:
                    <br />
                    <code className="text-blue-700 font-semibold mt-1 block">
                      AgreementScore = Clamp(100 - (0.45 * Disparity(Salary, Safety, Stability)), 35, 98)
                    </code>
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-900">5-Stage Recommendation Pipeline</div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="bg-slate-100 px-2 py-1 rounded font-semibold text-slate-700">1. Hard Eligibility Filter</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="bg-slate-100 px-2 py-1 rounded font-semibold text-slate-700">2. Psychometric Skill Match (25%)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="bg-slate-100 px-2 py-1 rounded font-semibold text-slate-700">3. Practical Interest Fit (28%)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="bg-slate-100 px-2 py-1 rounded font-semibold text-slate-700">4. Geographic Feasibility (15%)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="bg-slate-100 px-2 py-1 rounded font-semibold text-slate-700">5. Family Consensus Vector (20%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  4. Security, DPDP Act 2023 & OWASP ASVS Compliance
                </h4>
                <p className="text-xs text-slate-600">
                  Government-grade security controls protecting sensitive citizen and youth career records.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { title: 'V1: Architecture & Threat Modeling', desc: 'Strict zero-trust boundary. AI models run server-side; API keys are never leaked to client bundles.' },
                  { title: 'V2: Authentication Verification', desc: 'Secure token session validation, brute-force rate-limiting, and demo persona isolation.' },
                  { title: 'V3: Session & RBAC Authorization', desc: 'Granular role verification across Learner, Parent, Counsellor, and Admin. Object-level access control.' },
                  { title: 'V5: Validation & Anti-Injection', desc: 'Parameterized queries in PostgreSQL; strict schema typing via TypeScript and Pydantic-style validators.' },
                  { title: 'V8: Data Protection & DPDP 2023', desc: 'Data minimization, purpose limitation, parent-consent enforcement, and Right to be Forgotten deletion pipeline.' },
                  { title: 'V10: Tamper-Evident Audit Logging', desc: 'Comprehensive logging of all logins, AI overrides, assessment updates, and consent modifications.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  5. Docker Compose & Local Production Setup
                </h4>
                <p className="text-xs text-slate-600">
                  Multi-container orchestration setup configured in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">/docker-compose.yml</code>.
                </p>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-3">
                <div className="text-slate-400">// Clone and launch KaushalSaathi 360</div>
                <div className="text-emerald-400">$ git clone https://github.com/kaushalsaathi/kaushalsaathi360.git</div>
                <div className="text-emerald-400">$ cd kaushalsaathi360</div>
                <div className="text-slate-400">// Configure environment credentials in .env</div>
                <div className="text-emerald-400">$ cp .env.example .env</div>
                <div className="text-slate-400">// Run multi-container stack with Postgres + Redis + Web App</div>
                <div className="text-amber-400">$ docker-compose up --build</div>
                <div className="text-slate-400 mt-2">// Application is immediately available at http://localhost:3000</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
