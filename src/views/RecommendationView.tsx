import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  Search,
} from 'lucide-react';
import { CareerRecommendation, LanguageCode } from '../types';
import { t } from '../utils/i18n';

interface RecommendationViewProps {
  recommendations: CareerRecommendation[];
  currentLanguage: LanguageCode;
  onSelectCareer: (careerId: string) => void;
  onNavigate: (view: string) => void;
  onOpenVoice: () => void;
}

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  recommendations,
  currentLanguage,
  onSelectCareer,
  onNavigate,
  onOpenVoice,
}) => {
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sectors = ['all', ...Array.from(new Set(recommendations.map((r) => r.career.sector)))];

  const filtered = recommendations.filter((r) => {
    const matchesSector = sectorFilter === 'all' || r.career.sector === sectorFilter;
    const title = (r.career.title[currentLanguage] || r.career.title.en).toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || r.career.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Transparent AI Recommendation Engine
            </span>
            <span className="text-xs text-slate-400">• Anti-Blackbox Decision Support</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Personalized Vocational Career Recommendations
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Ranked through a 5-stage pipeline: Hard Eligibility → Psychometrics → Geographic Feasibility → Family Alignment → NCVET Verified Evidence.
          </p>
        </div>

        <button
          onClick={onOpenVoice}
          className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask Voc-Saathi AI to Explain</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trade, sector, keywords..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Sector:
          </span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                sectorFilter === sec
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {sec === 'all' ? 'All Sectors' : sec}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-6">
        {filtered.map((rec, index) => (
          <div
            key={rec.careerId}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-5"
          >
            {/* Top row: Rank, Title, Fit score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                  #{index + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {rec.career.title[currentLanguage] || rec.career.title.en}
                    </h2>
                    <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-200">
                      NSQF Level {rec.career.nsqfLevel}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {rec.career.sector}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {rec.career.description[currentLanguage] || rec.career.description.en}
                  </p>
                </div>
              </div>

              {/* Overall Fit Score Badge */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-emerald-700 font-black text-xl">
                    <TrendingUp className="w-5 h-5" />
                    <span>{rec.overallFitScore}%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Overall Fit Score
                  </span>
                </div>
              </div>
            </div>

            {/* 5-Vector Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Interest Match:</span>
                  <span className="text-blue-700 font-bold">{rec.whyBreakdown.interestMatch}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${rec.whyBreakdown.interestMatch}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Skill Match:</span>
                  <span className="text-blue-700 font-bold">{rec.whyBreakdown.skillMatch}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${rec.whyBreakdown.skillMatch}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Location Feasibility:</span>
                  <span className="text-indigo-700 font-bold">{rec.whyBreakdown.locationFeasibility}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${rec.whyBreakdown.locationFeasibility}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Training Seats:</span>
                  <span className="text-purple-700 font-bold">{rec.whyBreakdown.trainingAvailability}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${rec.whyBreakdown.trainingAvailability}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Family Alignment:</span>
                  <span className="text-amber-700 font-bold">{rec.whyBreakdown.familyAlignment}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${rec.whyBreakdown.familyAlignment}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Why This Was Recommended & Wage Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Why Explanation */}
              <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100 space-y-2 text-xs">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Transparent Explanation (Why this was recommended):</span>
                </div>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {rec.whyBreakdown.keyReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Key Verified Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-medium block">
                    Starting Monthly Salary
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {rec.career.entryMonthlySalaryRange}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                    NAPS Stipend: {rec.career.monthlyStipendDuringTraining}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] font-medium block">
                    Safety & Work Stability
                  </span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {rec.career.safetyScore}/100 Safety • {rec.career.jobStabilityScore}/100 Stability
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium block mt-0.5">
                    Suitable for Women: {rec.career.suitableForWomenScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Human Escalation Warning if Applicable */}
            {rec.humanEscalationRequired && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Human Escalation Recommended:</strong> {rec.escalationReason}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('family-consensus')}
                  className="text-xs font-bold text-amber-900 hover:underline shrink-0 cursor-pointer"
                >
                  Review Family Concerns →
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectCareer(rec.careerId);
                    onNavigate('career-details');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  View Full Career Dossier
                </button>
                <button
                  onClick={() => {
                    onSelectCareer(rec.careerId);
                    onNavigate('pathway-simulator');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>Simulate 3 Pathways</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onSelectCareer(rec.careerId);
                  onNavigate('career-compare');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                <span>Compare with Other Trades</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
