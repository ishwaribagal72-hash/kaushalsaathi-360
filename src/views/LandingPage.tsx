import React from 'react';
import {
  Compass,
  Users,
  Award,
  ShieldCheck,
  TrendingUp,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Building2,
  PhoneCall,
  Scale,
} from 'lucide-react';
import { User, LanguageCode, SystemAnalytics } from '../types';
import { t } from '../utils/i18n';

interface LandingPageProps {
  currentLanguage: LanguageCode;
  onNavigate: (view: string) => void;
  onSwitchUser: (user: User) => void;
  availableUsers: User[];
  analytics: SystemAnalytics;
  onOpenVoice: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLanguage,
  onNavigate,
  onSwitchUser,
  availableUsers,
  analytics,
  onOpenVoice,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Smart India Hackathon SIH26241 • Kaushal Vikas Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Bridging Student Dreams & Family Concerns in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
              Vocational Education
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {t(currentLanguage, 'tagline')}. A transparent, evidence-backed platform that aligns student psychometrics with parental trust using verified government wage data and zero-hallucination AI.
          </p>

          {/* Quick CTA Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('assessment')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Take Vocational Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('family-consensus')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Explore Family Consensus</span>
            </button>

            <button
              onClick={onOpenVoice}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Voice AI Assistant</span>
            </button>
          </div>

          {/* Live Government KPI Counter */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/80 p-3.5 rounded-xl text-left">
              <p className="text-[11px] text-slate-400 font-medium">Registered Learners</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {analytics.totalLearners.toLocaleString()}+
              </p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
                <CheckCircle2 className="w-3 h-3" /> All 28 States Covered
              </span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/80 p-3.5 rounded-xl text-left">
              <p className="text-[11px] text-slate-400 font-medium">Family Consensuses</p>
              <p className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
                {analytics.familyAgreementsReached.toLocaleString()}+
              </p>
              <span className="text-[10px] text-amber-400 flex items-center gap-0.5 mt-1">
                <Scale className="w-3 h-3" /> 78% Avg Agreement Score
              </span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/80 p-3.5 rounded-xl text-left">
              <p className="text-[11px] text-slate-400 font-medium">Verified Evidence Rate</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                {(analytics.evidenceClaimsVerifiedRate * 100).toFixed(0)}%
              </p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1">
                <ShieldCheck className="w-3 h-3" /> NCVET / PLFS Verified
              </span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs border border-slate-700/80 p-3.5 rounded-xl text-left">
              <p className="text-[11px] text-slate-400 font-medium">Counsellor Escalations</p>
              <p className="text-xl sm:text-2xl font-black text-purple-300 mt-0.5">
                {analytics.counsellorEscalationsResolved.toLocaleString()}+
              </p>
              <span className="text-[10px] text-purple-400 flex items-center gap-0.5 mt-1">
                <Award className="w-3 h-3" /> Human-in-the-Loop Safe
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Role Cards Section for Hackathon Jury Demo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Role-Based Multi-Stakeholder Workflows
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tailored Experiences for Every Family Decision-Maker
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Experience the platform from the perspective of students, parents, mentors, or policymakers with one-click persona switching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Learner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  ROLE A: YOUTH & STUDENT
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Learner Portal
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take aptitude tests, analyze skill gaps, discover transparent career recommendations, and simulate 3 pathways (Apprenticeship, Diploma, Entrepreneurship).
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>5-Vector Aptitude Assessment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Interactive Pathway Simulator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Action Plan Milestone Roadmap</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const learner = availableUsers.find((u) => u.role === 'learner');
                  if (learner) onSwitchUser(learner);
                  onNavigate('learner-dashboard');
                }}
                className="w-full py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch as Rohan (Learner)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Parent / Guardian */}
          <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between bg-gradient-to-b from-amber-50/30 to-white">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  ROLE B: GUARDIAN DECISION-SUPPORT
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Parent / Guardian Portal
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Voice concerns on starting salary, physical safety, and job stability. Review verified evidence cards to resolve anxieties and reach family consensus.
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Family Consensus Agreement Meter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>6 Parent Concern Sliders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Official PLFS / NAPS Evidence Cards</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-amber-100">
              <button
                onClick={() => {
                  const parent = availableUsers.find((u) => u.role === 'parent');
                  if (parent) onSwitchUser(parent);
                  onNavigate('family-consensus');
                }}
                className="w-full py-2 bg-amber-100 hover:bg-amber-500 text-amber-900 hover:text-slate-950 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch as Suresh (Parent)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Counsellor */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  ROLE C: HUMAN PROFESSIONAL MENTOR
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Counsellor Desk
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Triage cases with high family conflict or low evidence confidence. Review student dossiers, override AI recommendations with rationale, and mediate.
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>High-Risk Triage Queue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Human AI Recommendation Override</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Mediation Notes & Action Finalization</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const counsellor = availableUsers.find((u) => u.role === 'counsellor');
                  if (counsellor) onSwitchUser(counsellor);
                  onNavigate('counsellor-desk');
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch as Dr. Anjali (Counsellor)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Administrator */}
          <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  ROLE D: SYSTEM GOVERNANCE
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Admin & Audits
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Oversee evidence verification, calibrate AI thresholds, manage career catalogue, and inspect OWASP ASVS tamper-evident audit trails.
              </p>
              <div className="space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Evidence Source Verifier</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Tamper-Evident Audit Trails</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>State & District Skill Analytics</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  const admin = availableUsers.find((u) => u.role === 'admin');
                  if (admin) onSwitchUser(admin);
                  onNavigate('admin-panel');
                }}
                className="w-full py-2 bg-purple-50 hover:bg-purple-600 text-purple-800 hover:text-white rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch as Priya (Admin)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Innovation Spotlight: The Family Consensus Engine */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-slate-950 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="bg-slate-950 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                FLAGSHIP INNOVATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                The Family Consensus Engine™
              </h2>
              <p className="text-sm font-medium text-slate-900 leading-relaxed">
                In India, vocational education decisions are not made by the student alone. Parents worry about low starting stipends, workshop safety, and community status.
              </p>
              <div className="space-y-2 text-xs font-semibold text-slate-950">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[11px]">
                    1
                  </div>
                  <span>Learner Preference Vector captures passion, mobility, and technical drive.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[11px]">
                    2
                  </div>
                  <span>Parent Concern Vector captures wage anxiety, safety fears, and social status.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[11px]">
                    3
                  </div>
                  <span>Engine calculates Agreement Score % and retrieves verified counter-evidence cards.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('family-consensus')}
                  className="px-6 py-3 bg-slate-950 text-white hover:bg-slate-900 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Open Interactive Family Consensus Screen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual simulation card */}
            <div className="bg-white rounded-2xl p-5 shadow-2xl border border-amber-300/60 text-slate-900 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Live Case Simulation: Rohan & Suresh Sharma
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Target Trade: Industrial & Domestic Electrician (NSQF Level 4)
                  </p>
                </div>
                <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-black">
                  74% Consensus
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Agreement Score</span>
                  <span className="text-amber-700">74% Alignment</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 w-[74%]" />
                </div>
              </div>

              {/* Conflict Callout */}
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 text-xs space-y-1">
                <div className="font-bold text-orange-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-orange-600" />
                  <span>Salary Expectation Disparity Detected</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Parent Concern:</strong> "Unorganized wiremen earn erratic daily wages with no pension."<br />
                  <strong>Verified Evidence:</strong> MoSPI PLFS Bulletin shows certified NAPS technicians earn starting ₹16,500/mo rising to ₹32,000/mo in organized manufacturing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
