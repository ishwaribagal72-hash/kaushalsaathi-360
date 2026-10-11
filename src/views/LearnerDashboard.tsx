import React from 'react';
import {
  Compass,
  Users,
  Award,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Bookmark,
  Building,
  AlertCircle,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import {
  LearnerProfile,
  CareerRecommendation,
  FamilyConsensusCase,
  ActionPlan,
  LanguageCode,
} from '../types';
import { t } from '../utils/i18n';

interface LearnerDashboardProps {
  profile: LearnerProfile;
  recommendations: CareerRecommendation[];
  familyCase: FamilyConsensusCase;
  actionPlan: ActionPlan;
  currentLanguage: LanguageCode;
  onNavigate: (view: string) => void;
  onSelectCareer: (careerId: string) => void;
  onOpenVoice: () => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  profile,
  recommendations,
  familyCase,
  actionPlan,
  currentLanguage,
  onNavigate,
  onSelectCareer,
  onOpenVoice,
}) => {
  const topRecommendations = recommendations.slice(0, 3);
  const completedMilestones = actionPlan?.milestones?.filter((m) => m.completed)?.length || 0;
  const totalMilestones = actionPlan?.milestones?.length || 1;
  const milestoneProgress = Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Learner Greeting & Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            RS
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Rohan Sharma
              </h1>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                NSQF Level 4 Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              10th Standard Pass • Pune, Maharashtra • Preference: Mechanical & Renewable Energy Trades
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                Aptitude Assessed: Practical 92% • Mechanical 88%
              </span>
              <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-md font-medium border border-amber-200">
                Father Suresh Linked
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('assessment')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Retake Assessment
          </button>
          <button
            onClick={onOpenVoice}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Voc-Saathi AI</span>
          </button>
        </div>
      </div>

      {/* 3 Quick Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Family Consensus Banner */}
        <div
          onClick={() => onNavigate('family-consensus')}
          className="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 rounded-2xl border border-amber-200 p-5 shadow-xs cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Family Consensus Status
            </span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {familyCase.agreementScore}%
            </span>
            <span className="text-xs font-bold text-amber-700">
              Agreement Score
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Target: <strong>{familyCase.selectedCareerTitle}</strong>. 2 discussion topics flagged for dinner-table review.
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-800">
            <span>Review Consensus & Evidence</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Metric 2: Pathway Simulation */}
        <div
          onClick={() => onNavigate('pathway-simulator')}
          className="bg-gradient-to-br from-blue-50 via-white to-blue-50/40 rounded-2xl border border-blue-200 p-5 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">
              Pathway Simulator
            </span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">3</span>
            <span className="text-xs font-bold text-blue-700">
              Simulated Pathways
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
            Compare <strong>NAPS Apprenticeship</strong> vs <strong>Polytechnic Diploma</strong> vs <strong>Mudra Entrepreneurship</strong>.
          </p>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-blue-800">
            <span>Launch Multi-Pathway Simulator</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Metric 3: Action Plan Roadmap */}
        <div
          onClick={() => onNavigate('action-plan')}
          className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 rounded-2xl border border-emerald-200 p-5 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Action Plan Progress
            </span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {milestoneProgress}%
            </span>
            <span className="text-xs font-bold text-emerald-700">
              Milestones Done ({completedMilestones}/{totalMilestones})
            </span>
          </div>
          <div className="w-full h-2 bg-emerald-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${milestoneProgress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-800">
            <span>View Full Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Top Vocational Career Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              AI-Recommended Vocational Careers
            </h2>
            <p className="text-xs text-slate-500">
              Calibrated by 5-vector matching: Interests, Skills, Feasibility, Family Alignment & NCVET Evidence.
            </p>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topRecommendations.map((rec) => (
            <div
              key={rec.careerId}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                    NSQF Level {rec.career.nsqfLevel}
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold border border-emerald-200">
                    <TrendingUp className="w-3 h-3" />
                    <span>{rec.overallFitScore}% Match</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {rec.career.title[currentLanguage] || rec.career.title.en}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {rec.career.sector}
                  </p>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {rec.career.description[currentLanguage] || rec.career.description.en}
                </p>

                {/* Wage & Safety Highlights */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Entry Salary:</span>
                    <span className="font-bold text-slate-900 text-[11px]">
                      {rec.career.entryMonthlySalaryRange}/mo
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-[11px]">Safety Rating:</span>
                    <span className="font-bold text-emerald-700 text-[11px]">
                      {rec.career.safetyScore}/100 (IS 732 Verified)
                    </span>
                  </div>
                </div>

                {/* Transparent WHY preview */}
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Interest Match:</span>
                    <span className="text-blue-700">{rec.whyBreakdown.interestMatch}%</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Skill Match:</span>
                    <span className="text-blue-700">{rec.whyBreakdown.skillMatch}%</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Family Alignment:</span>
                    <span className="text-amber-700">{rec.whyBreakdown.familyAlignment}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectCareer(rec.careerId);
                    onNavigate('career-details');
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors text-center cursor-pointer"
                >
                  View Details & Institutes
                </button>
                <button
                  onClick={() => {
                    onSelectCareer(rec.careerId);
                    onNavigate('pathway-simulator');
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                  title="Simulate 3 Pathways"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Psychometric Aptitude Profile Snapshot */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Psychometric & Vocational Aptitude Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across 5 standardized vocational cognitive domains.
            </p>
          </div>
          <button
            onClick={() => onNavigate('assessment')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Manage Assessment Answers
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Practical Hands-on', score: profile.aptitudeScores?.practical || 92, color: 'bg-emerald-500' },
            { label: 'Mechanical Reasoning', score: profile.aptitudeScores?.mechanical || 88, color: 'bg-blue-500' },
            { label: 'Spatial Visualization', score: profile.aptitudeScores?.spatial || 82, color: 'bg-indigo-500' },
            { label: 'Digital / Automation', score: profile.aptitudeScores?.digital || 65, color: 'bg-amber-500' },
            { label: 'People & Caregiving', score: profile.aptitudeScores?.peopleCare || 58, color: 'bg-rose-500' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-bold text-slate-700">{item.label}</span>
                <span className="text-xs font-black text-slate-900">{item.score}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
