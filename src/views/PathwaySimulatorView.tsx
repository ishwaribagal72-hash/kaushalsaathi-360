import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  DollarSign,
  Clock,
  Briefcase,
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { CareerRole, CareerPathway, LanguageCode } from '../types';

interface PathwaySimulatorViewProps {
  careers: CareerRole[];
  selectedCareerId: string;
  onSelectCareer: (careerId: string) => void;
  currentLanguage: LanguageCode;
  onNavigate: (view: string) => void;
}

export const PathwaySimulatorView: React.FC<PathwaySimulatorViewProps> = ({
  careers,
  selectedCareerId,
  onSelectCareer,
  currentLanguage,
  onNavigate,
}) => {
  const currentCareer = careers.find((c) => c.id === selectedCareerId) || careers[0];
  const [activePathKey, setActivePathKey] = useState<'pathA' | 'pathB' | 'pathC'>('pathA');

  const pathways = currentCareer.pathwayOptions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Interactive Pathway Simulator
            </span>
            <span className="text-xs text-slate-400">• 3 Divergent Vocational Horizons</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Simulate 3 Career Pathways for {currentCareer.title[currentLanguage] || currentCareer.title.en}
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Compare time investment, training costs, earning stipends, and long-term career ceilings across Apprenticeship, Higher Diploma, and Entrepreneurship.
          </p>
        </div>

        {/* Career Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-bold text-slate-700">Trade:</label>
          <select
            value={currentCareer.id}
            onChange={(e) => onSelectCareer(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title[currentLanguage] || c.title.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Pathway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            key: 'pathA' as const,
            pathway: pathways.pathA,
            badge: 'PATHWAY A: APPRENTICESHIP',
            badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            border: activePathKey === 'pathA' ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200',
            tagline: 'Direct Industry Absorption via NAPS',
          },
          {
            key: 'pathB' as const,
            pathway: pathways.pathB,
            badge: 'PATHWAY B: HIGHER DIPLOMA',
            badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
            border: activePathKey === 'pathB' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-slate-200',
            tagline: 'Academic Ladder to Junior Engineer',
          },
          {
            key: 'pathC' as const,
            pathway: pathways.pathC,
            badge: 'PATHWAY C: ENTREPRENEURSHIP',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            border: activePathKey === 'pathC' ? 'ring-2 ring-amber-500 border-amber-500' : 'border-slate-200',
            tagline: 'Mudra Seed Loan & Contracting Business',
          },
        ].map((item) => (
          <div
            key={item.key}
            onClick={() => setActivePathKey(item.key)}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between ${item.border}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {item.pathway.evidenceConfidence} Confidence
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {item.pathway.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  {item.tagline}
                </p>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Timeline</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {item.pathway.durationMonths} Months
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Est. Cost</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    ₹{item.pathway.estimatedCostINR.toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60 flex justify-between">
                  <span className="text-[10px] text-slate-500">Stipend/Earnings:</span>
                  <span className="text-[11px] font-black text-emerald-700">
                    ₹{item.pathway.stipendOrEarningsDuringStageINR.toLocaleString()}/mo
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed text-[11px]">
                <strong>Progression:</strong> {item.pathway.progressionOutlook}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600">
                {activePathKey === item.key ? 'Currently Viewing Timeline ↓' : 'Click to Inspect Timeline'}
              </span>
              <CheckCircle2
                className={`w-4 h-4 ${
                  activePathKey === item.key ? 'text-blue-600' : 'text-slate-300'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Selected Pathway Detailed Timeline Stages */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400">
              Interactive Execution Timeline
            </span>
            <h3 className="text-base font-extrabold text-slate-900">
              Detailed Stage-by-Stage Milestones for {pathways[activePathKey].title}
            </h3>
          </div>
          <button
            onClick={() => onNavigate('action-plan')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Apply to My Action Plan Roadmap
          </button>
        </div>

        {/* Stepper Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {pathways[activePathKey].stages.map((stg, idx) => (
            <div
              key={stg.step}
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 space-y-3 relative"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  {stg.step}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {stg.timelineMonths > 0 ? `${stg.timelineMonths} Months` : 'Permanent Goal'}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {stg.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  <strong>Key Milestone:</strong> {stg.milestone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparative Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900">
          Side-by-Side Pathway Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="pb-3">Decision Parameter</th>
                <th className="pb-3 text-emerald-800">Path A: Apprenticeship (NAPS)</th>
                <th className="pb-3 text-blue-800">Path B: Polytechnic Diploma</th>
                <th className="pb-3 text-amber-800">Path C: Mudra Entrepreneurship</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-3 font-bold text-slate-900">Total Duration</td>
                <td className="py-3">{pathways.pathA.durationMonths} Months</td>
                <td className="py-3">{pathways.pathB.durationMonths} Months</td>
                <td className="py-3">{pathways.pathC.durationMonths} Months</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Estimated Direct Out-of-Pocket Cost</td>
                <td className="py-3 font-semibold text-emerald-700">₹{pathways.pathA.estimatedCostINR} (Nominal ITI Fee)</td>
                <td className="py-3">₹{pathways.pathB.estimatedCostINR}</td>
                <td className="py-3">₹{pathways.pathC.estimatedCostINR} (Working Capital)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Stipend or Income during phase</td>
                <td className="py-3 font-semibold text-emerald-700">₹{pathways.pathA.stipendOrEarningsDuringStageINR}/mo guaranteed</td>
                <td className="py-3">₹{pathways.pathB.stipendOrEarningsDuringStageINR}/mo</td>
                <td className="py-3 font-semibold text-amber-700">₹{pathways.pathC.stipendOrEarningsDuringStageINR}/mo business cashflow</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Min. Entry Eligibility</td>
                <td className="py-3">10th Standard Pass</td>
                <td className="py-3">10th + ITI Trade Certificate</td>
                <td className="py-3">Certified Trade + State License</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Government Scheme Backing</td>
                <td className="py-3">NAPS Direct Benefit Transfer</td>
                <td className="py-3">AICTE Pragati / Post-Matric Scholarship</td>
                <td className="py-3">PMMY Mudra / CGTMSE Collateral-Free</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-slate-900">Evidence Confidence</td>
                <td className="py-3 font-bold text-emerald-700">HIGH (Statutory Gazette)</td>
                <td className="py-3 font-bold text-blue-700">HIGH (Technical Board)</td>
                <td className="py-3 font-bold text-amber-700">MEDIUM (Market Dependent)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
