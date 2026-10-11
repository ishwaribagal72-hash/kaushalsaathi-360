import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Building,
  Award,
  ArrowRight,
  Bookmark,
  Calendar,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { CareerRole, EvidenceClaim, LanguageCode } from '../types';

interface CareerDetailViewProps {
  career: CareerRole;
  claims: EvidenceClaim[];
  currentLanguage: LanguageCode;
  onNavigate: (view: string) => void;
  onOpenVoice: () => void;
}

export const CareerDetailView: React.FC<CareerDetailViewProps> = ({
  career,
  claims,
  currentLanguage,
  onNavigate,
  onOpenVoice,
}) => {
  const linkedClaims = claims.filter((c) => c.careerId === career.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Career Dossier Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              NSQF Level {career.nsqfLevel}
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {career.sector}
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              NCVET Certified Trade
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {career.title[currentLanguage] || career.title.en}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {career.description[currentLanguage] || career.description.en}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('pathway-simulator')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Simulate 3 Pathways</span>
          </button>
          <button
            onClick={() => onNavigate('family-consensus')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Check Family Alignment
          </button>
        </div>
      </div>

      {/* 4 Big Key Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Entry Monthly Salary
          </span>
          <p className="text-xl font-black text-slate-900">
            {career.entryMonthlySalaryRange}
          </p>
          <span className="text-[10px] text-emerald-600 font-medium block">
            Mid-Career: {career.midCareerMonthlySalaryRange}/mo
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            NAPS Training Stipend
          </span>
          <p className="text-xl font-black text-blue-700">
            {career.monthlyStipendDuringTraining}
          </p>
          <span className="text-[10px] text-slate-500 font-medium block">
            Duration: {career.trainingDurationMonths} Months
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Safety & Environment
          </span>
          <p className="text-xl font-black text-emerald-700">
            {career.safetyScore}/100
          </p>
          <span className="text-[10px] text-emerald-600 font-medium block">
            IS 732 Standard Compliant
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            5-Year Demand Growth
          </span>
          <p className="text-xl font-black text-purple-700">
            {career.growthRate5Yr}
          </p>
          <span className="text-[10px] text-purple-600 font-medium block">
            National Infrastructure Push
          </span>
        </div>
      </div>

      {/* Main Dossier Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Requirements, Institutes, Schemes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility & Skills Required */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Entry Eligibility & Core Technical Competencies
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-700 block mb-0.5">Minimum Educational Qualification:</span>
              <span className="text-slate-900 font-semibold">{career.requiredEducation}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Required Skills (NSQF Level {career.nsqfLevel}):</span>
              <div className="flex flex-wrap gap-2">
                {career.skillsRequired.map((sk, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1 rounded-lg border border-blue-100"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Associated Certified Training Institutes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Accredited Institutes in Maharashtra & Pune Cluster</span>
            </h3>

            <div className="space-y-3">
              {career.associatedInstitutes.map((inst, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-slate-900 block text-xs">
                      {inst.name}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {inst.location} • NCVET Affiliated
                    </span>
                  </div>
                  <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md font-bold text-slate-700 text-[10px]">
                    {inst.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Government Schemes & Subsidies */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600" />
              <span>Government Schemes & Financial Entitlements</span>
            </h3>

            <ul className="space-y-2 text-xs text-slate-700">
              {career.governmentSchemes.map((sch, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-900">{sch}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Verified Evidence Trust Engine Claims */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-4 bg-gradient-to-b from-emerald-50/30 to-white">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Verified Evidence Claims (Evidence Trust Engine™)
              </h3>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Every factual assertion below is indexed from gazette notifications and labour force surveys with confidence tracking.
            </p>

            <div className="space-y-3">
              {linkedClaims.length === 0 ? (
                <p className="text-xs text-slate-400">No specific linked claims.</p>
              ) : (
                linkedClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {claim.claimType}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700">
                        {(claim.confidence * 100).toFixed(0)}% Confidence
                      </span>
                    </div>

                    <p className="text-slate-800 text-[11px] leading-relaxed font-medium">
                      {claim.claimStatement[currentLanguage] || claim.claimStatement.en}
                    </p>

                    <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-semibold">
                      Metric: {claim.metricValue}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('evidence-trust')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors text-center cursor-pointer"
              >
                Inspect All Government Sources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
