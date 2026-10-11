import React, { useState } from 'react';
import {
  Users,
  Scale,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  FileCheck2,
  Calendar,
  Sparkles,
  Award,
  ChevronDown,
  CheckCircle2,
  PhoneForwarded,
} from 'lucide-react';
import { FamilyConsensusCase, LanguageCode, CareerRole } from '../types';
import { api } from '../utils/api';

interface FamilyConsensusViewProps {
  familyCase: FamilyConsensusCase;
  careers: CareerRole[];
  currentLanguage: LanguageCode;
  onUpdateCase: (updatedCase: FamilyConsensusCase) => void;
  onNavigate: (view: string) => void;
  onOpenVoice: () => void;
}

export const FamilyConsensusView: React.FC<FamilyConsensusViewProps> = ({
  familyCase,
  careers,
  currentLanguage,
  onUpdateCase,
  onNavigate,
  onOpenVoice,
}) => {
  const [concerns, setConcerns] = useState(familyCase.parentConcernVector);
  const [selectedCareerId, setSelectedCareerId] = useState(familyCase.selectedCareerId);
  const [isUpdating, setIsUpdating] = useState(false);
  const [mediationModalOpen, setMediationModalOpen] = useState(false);
  const [mediationReason, setMediationReason] = useState(
    'Parents concerned about starting wage stability and lack of white-collar degree prestige.'
  );
  const [mediationSuccess, setMediationSuccess] = useState(false);

  const handleSliderChange = (key: keyof typeof concerns, value: number) => {
    setConcerns((prev) => ({ ...prev, [key]: value }));
  };

  const handleRecalculateConsensus = async () => {
    setIsUpdating(true);
    try {
      const updated = await api.updateFamilyConcerns(familyCase.learnerId, concerns, selectedCareerId);
      onUpdateCase(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRequestMediation = async () => {
    try {
      await api.requestCounsellorMediation(familyCase.learnerId, mediationReason);
      setMediationSuccess(true);
      setTimeout(() => {
        setMediationModalOpen(false);
        setMediationSuccess(false);
      }, 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Score color helper
  const scoreBadgeColor =
    familyCase.agreementScore >= 80
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : familyCase.agreementScore >= 60
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950/40 text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-amber-400/30">
              SIH26241 Unique Engine
            </span>
            <span className="text-xs text-amber-100">• Multi-Stakeholder Alignment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Family Decision Consensus Engine™
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
            Reconciles learner vocational ambition with parental anxieties (salary, safety, status) through mathematical vector comparison and verified government evidence.
          </p>
        </div>

        {/* Big Agreement Meter */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[180px]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-100 block">
            Agreement Score
          </span>
          <span className="text-4xl sm:text-5xl font-black text-white block mt-1">
            {familyCase.agreementScore}%
          </span>
          <span className="text-[10px] font-bold text-amber-200 bg-black/20 px-2 py-0.5 rounded-full inline-block mt-1">
            {familyCase.agreementScore >= 75 ? 'Moderate to High Alignment' : 'Disparity Flagged'}
          </span>
        </div>
      </div>

      {/* Career Selection & Active Participants */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white">
              RS
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs ring-2 ring-white">
              SS
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-900">
                {familyCase.learnerName} (Learner)
              </span>
              <span className="text-slate-400 text-xs">↔</span>
              <span className="text-xs font-extrabold text-slate-900">
                {familyCase.parentName} (Parent)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Assessing consensus for vocational trade:
            </p>
          </div>
        </div>

        {/* Career Trade Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCareerId}
            onChange={(e) => setSelectedCareerId(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title[currentLanguage] || c.title.en} (NSQF Level {c.nsqfLevel})
              </option>
            ))}
          </select>

          <button
            onClick={handleRecalculateConsensus}
            disabled={isUpdating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            {isUpdating ? 'Recalculating...' : 'Recalculate'}
          </button>
        </div>
      </div>

      {/* Dual Vector Comparison Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Learner Preference Vector */}
        <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                VECTOR A
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Learner Preference Vector
              </h3>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              Rohan Sharma
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Calibrated from psychometric assessment answers, practical aptitude tests, and stated career goals.
          </p>

          <div className="space-y-3.5">
            {[
              { label: 'Trade Passion & Motivation', val: familyCase.learnerPreferenceVector.passionWeight, color: 'bg-blue-600' },
              { label: 'Hands-on Technical Preference', val: familyCase.learnerPreferenceVector.handsOnPreference, color: 'bg-emerald-600' },
              { label: 'Tech & Electrical Affinity', val: familyCase.learnerPreferenceVector.techAffinity, color: 'bg-indigo-600' },
              { label: 'Willingness to Relocate / Travel', val: familyCase.learnerPreferenceVector.willingToTravel, color: 'bg-purple-600' },
              { label: 'Entrepreneurial Drive (Mudra)', val: familyCase.learnerPreferenceVector.entrepreneurialDrive, color: 'bg-amber-600' },
            ].map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{v.label}</span>
                  <span className="text-slate-900 font-bold">{v.val}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${v.color} rounded-full`} style={{ width: `${v.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Parent Concern Vector (Interactive Sliders) */}
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4 bg-gradient-to-b from-amber-50/20 to-white">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                VECTOR B (INTERACTIVE)
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Parent Concern Vector
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200">
              Suresh Sharma
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Adjust the sliders below to simulate how easing or raising parental concerns shifts the family agreement score!
          </p>

          <div className="space-y-4">
            {[
              { key: 'salaryConcern', label: '1. Monthly Starting Salary Concern', val: concerns.salaryConcern },
              { key: 'safetyConcern', label: '2. Physical Safety & Voltage Hazard Anxiety', val: concerns.safetyConcern },
              { key: 'jobSecurityConcern', label: '3. Long-Term Job Security & PF/ESI Concern', val: concerns.jobSecurityConcern },
              { key: 'trainingCostConcern', label: '4. ITI Admission & Tool Costs Concern', val: concerns.trainingCostConcern },
              { key: 'distanceConcern', label: '5. Distance from Hometown / District Concern', val: concerns.distanceConcern },
              { key: 'socialStatusConcern', label: '6. Social Prestige vs Degree Stereotype Concern', val: concerns.socialStatusConcern },
            ].map((c) => (
              <div key={c.key} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{c.label}</span>
                  <span
                    className={`font-black text-xs px-2 py-0.5 rounded ${
                      c.val >= 70
                        ? 'bg-rose-100 text-rose-800'
                        : c.val >= 40
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {c.val}% ({c.val >= 70 ? 'High' : c.val >= 40 ? 'Moderate' : 'Low'})
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={c.val}
                  onChange={(e) => handleSliderChange(c.key as any, Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleRecalculateConsensus}
              disabled={isUpdating}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              {isUpdating ? 'Recalculating...' : 'Update Concerns & Refresh Conflict Areas'}
            </button>
          </div>
        </div>
      </div>

      {/* Conflict Areas & Verified Government Counter-Evidence */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-600" />
            <span>Detected Conflict Areas & Verified Government Evidence Cards</span>
          </h2>
          <p className="text-xs text-slate-500">
            Official evidence claims automatically retrieved from NCVET, PLFS, and NAPS gazettes to alleviate parental hesitation.
          </p>
        </div>

        <div className="space-y-4">
          {familyCase.conflictAreas.map((conflict, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-amber-300 transition-colors"
            >
              {/* Conflict Header */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                    !
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">
                      Conflict Area: {conflict.topic}
                    </h3>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        conflict.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {conflict.severity} Severity
                    </span>
                  </div>
                </div>
              </div>

              {/* Both Sides Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 space-y-1">
                  <span className="text-[10px] font-bold text-blue-700 uppercase block">
                    Learner's Perspective (Rohan):
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    "{conflict.learnerPosition}"
                  </p>
                </div>

                <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100 space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">
                    Parent's Anxiety (Suresh):
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    "{conflict.parentPosition}"
                  </p>
                </div>
              </div>

              {/* Verified Government Evidence Counter-Card */}
              {conflict.verifiedEvidenceClaim && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-900 font-extrabold flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Verified Government Counter-Evidence (Evidence Trust Engine™)
                    </span>
                    <span className="bg-emerald-200/60 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {(conflict.verifiedEvidenceClaim.confidence * 100).toFixed(0)}% Confidence Verified
                    </span>
                  </div>

                  <p className="text-slate-800 leading-relaxed font-medium text-[11px]">
                    {conflict.verifiedEvidenceClaim.claimStatement[currentLanguage] ||
                      conflict.verifiedEvidenceClaim.claimStatement.en}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-3 text-[10px] text-emerald-800 font-medium">
                    <span><strong>Metric:</strong> {conflict.verifiedEvidenceClaim.metricValue}</span>
                    <span>•</span>
                    <span><strong>Citation:</strong> MoSPI PLFS Annual Report Table 41.2</span>
                    <span>•</span>
                    <span><strong>Geography:</strong> Pan-India (Maharashtra Clustered)</span>
                  </div>
                </div>
              )}

              {/* Suggested Discussion Prompt */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">
                    Recommended Dinner-Table Discussion Question:
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">
                    "{conflict.suggestedDiscussionPrompt}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unresolved Questions & Counsellor Mediation Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Unresolved Questions for Family Round-Table
            </h3>
            <p className="text-xs text-slate-500">
              Questions that need verification from an institute or certified vocational counsellor.
            </p>
          </div>

          <button
            onClick={() => setMediationModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PhoneForwarded className="w-3.5 h-3.5" />
            <span>Request Counsellor Mediation Call</span>
          </button>
        </div>

        <ul className="space-y-2">
          {familyCase.unresolvedQuestions.map((q, i) => (
            <li
              key={i}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex items-start gap-2.5"
            >
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Counsellor Mediation Modal */}
      {mediationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Request Human Counsellor Mediation
                </h3>
              </div>
              <button
                onClick={() => setMediationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {mediationSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">
                  Mediation Scheduled!
                </p>
                <p className="text-xs text-emerald-700">
                  Assigned Counsellor Dr. Anjali Deshmukh has received your family dossier and will schedule a joint video consultation.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When consensus agreement cannot be reached at home, an NCVET-certified government counsellor can facilitate a structured mediation call with both student and parents.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Primary reason for mediation:
                  </label>
                  <textarea
                    rows={3}
                    value={mediationReason}
                    onChange={(e) => setMediationReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setMediationModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequestMediation}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
