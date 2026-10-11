import React, { useState } from 'react';
import {
  Scale,
  TrendingUp,
  ShieldCheck,
  Building,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { CareerRole, LanguageCode } from '../types';

interface CareerCompareViewProps {
  careers: CareerRole[];
  currentLanguage: LanguageCode;
  onNavigate: (view: string) => void;
  onSelectCareer: (careerId: string) => void;
}

export const CareerCompareView: React.FC<CareerCompareViewProps> = ({
  careers,
  currentLanguage,
  onNavigate,
  onSelectCareer,
}) => {
  const [careerAId, setCareerAId] = useState<string>(careers[0]?.id || 'car-elec-01');
  const [careerBId, setCareerBId] = useState<string>(careers[1]?.id || 'car-solar-02');
  const [careerCId, setCareerCId] = useState<string>(careers[2]?.id || 'car-ev-03');

  const careerA = careers.find((c) => c.id === careerAId) || careers[0];
  const careerB = careers.find((c) => c.id === careerBId) || careers[1];
  const careerC = careers.find((c) => c.id === careerCId) || careers[2];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Vocational Comparison Matrix
            </span>
            <span className="text-xs text-slate-400">• Side-by-Side Trade Analysis</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Compare 3 Vocational Trades
          </h1>
          <p className="text-xs text-slate-500">
            Compare wages, safety ratings, training commitments, and female participation scores across trades.
          </p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Trade 1 (Left)', val: careerAId, setVal: setCareerAId },
          { label: 'Trade 2 (Center)', val: careerBId, setVal: setCareerBId },
          { label: 'Trade 3 (Right)', val: careerCId, setVal: setCareerCId },
        ].map((sel, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase">{sel.label}</label>
            <select
              value={sel.val}
              onChange={(e) => sel.setVal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-lg p-2"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title[currentLanguage] || c.title.en}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-900">
                <th className="p-4 font-bold uppercase text-[10px] text-slate-400 w-1/4">Metric</th>
                <th className="p-4 font-black text-blue-900 text-sm w-1/4">
                  {careerA.title[currentLanguage] || careerA.title.en}
                </th>
                <th className="p-4 font-black text-indigo-900 text-sm w-1/4">
                  {careerB.title[currentLanguage] || careerB.title.en}
                </th>
                <th className="p-4 font-black text-amber-900 text-sm w-1/4">
                  {careerC.title[currentLanguage] || careerC.title.en}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Industry Sector</td>
                <td className="p-4">{careerA.sector}</td>
                <td className="p-4">{careerB.sector}</td>
                <td className="p-4">{careerC.sector}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">NSQF Level</td>
                <td className="p-4 font-bold text-blue-700">Level {careerA.nsqfLevel}</td>
                <td className="p-4 font-bold text-indigo-700">Level {careerB.nsqfLevel}</td>
                <td className="p-4 font-bold text-amber-700">Level {careerC.nsqfLevel}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Starting Monthly Salary</td>
                <td className="p-4 font-black text-slate-900">{careerA.entryMonthlySalaryRange}</td>
                <td className="p-4 font-black text-slate-900">{careerB.entryMonthlySalaryRange}</td>
                <td className="p-4 font-black text-slate-900">{careerC.entryMonthlySalaryRange}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Mid-Career Salary (5-Yr)</td>
                <td className="p-4 font-bold text-emerald-700">{careerA.midCareerMonthlySalaryRange}</td>
                <td className="p-4 font-bold text-emerald-700">{careerB.midCareerMonthlySalaryRange}</td>
                <td className="p-4 font-bold text-emerald-700">{careerC.midCareerMonthlySalaryRange}</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Training Duration</td>
                <td className="p-4">{careerA.trainingDurationMonths} Months</td>
                <td className="p-4">{careerB.trainingDurationMonths} Months</td>
                <td className="p-4">{careerC.trainingDurationMonths} Months</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Workplace Safety Score</td>
                <td className="p-4 font-bold text-slate-900">{careerA.safetyScore} / 100</td>
                <td className="p-4 font-bold text-slate-900">{careerB.safetyScore} / 100</td>
                <td className="p-4 font-bold text-slate-900">{careerC.safetyScore} / 100</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Job Stability Score</td>
                <td className="p-4 font-bold text-slate-900">{careerA.jobStabilityScore} / 100</td>
                <td className="p-4 font-bold text-slate-900">{careerB.jobStabilityScore} / 100</td>
                <td className="p-4 font-bold text-slate-900">{careerC.jobStabilityScore} / 100</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Female Workforce Friendly</td>
                <td className="p-4 font-bold text-purple-700">{careerA.suitableForWomenScore} / 100</td>
                <td className="p-4 font-bold text-purple-700">{careerB.suitableForWomenScore} / 100</td>
                <td className="p-4 font-bold text-purple-700">{careerC.suitableForWomenScore} / 100</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-900 bg-slate-50/50">Explore Pathways</td>
                <td className="p-4">
                  <button
                    onClick={() => {
                      onSelectCareer(careerA.id);
                      onNavigate('pathway-simulator');
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Simulate →
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => {
                      onSelectCareer(careerB.id);
                      onNavigate('pathway-simulator');
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Simulate →
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => {
                      onSelectCareer(careerC.id);
                      onNavigate('pathway-simulator');
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Simulate →
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
