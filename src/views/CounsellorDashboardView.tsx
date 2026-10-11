import React, { useState } from 'react';
import {
  Award,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileText,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Calendar,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import {
  CounsellorCase,
  CareerRole,
  LanguageCode,
  FamilyConsensusCase,
  LearnerProfile,
} from '../types';
import { api } from '../utils/api';

interface CounsellorDashboardViewProps {
  cases: CounsellorCase[];
  careers: CareerRole[];
  currentLanguage: LanguageCode;
  onUpdateCase: (updatedCase: CounsellorCase) => void;
  onNavigate: (view: string) => void;
}

export const CounsellorDashboardView: React.FC<CounsellorDashboardViewProps> = ({
  cases,
  careers,
  currentLanguage,
  onUpdateCase,
  onNavigate,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || 'cns-case-01');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [newNote, setNewNote] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [overrideCareerId, setOverrideCareerId] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const activeTargetCareer = careers.find((c) => c.id === activeCase?.topCareerRecommendationId) || careers[0];

  const filteredCases = cases.filter((c) => {
    if (filterRisk === 'all') return true;
    return c.riskCategory === filterRisk || c.status === filterRisk;
  });

  const handleAddNote = async () => {
    if (!newNote.trim() || !activeCase) return;
    setIsSubmitting(true);
    try {
      const res = await api.addCounsellorNote(
        activeCase.id,
        newNote,
        actionTaken || 'Guidance session recorded.',
        'Dr. Anjali Deshmukh'
      );
      onUpdateCase(res);
      setNewNote('');
      setActionTaken('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverrideAI = async () => {
    if (!overrideCareerId || !overrideReason.trim() || !activeCase) return;
    setIsSubmitting(true);
    try {
      const res = await api.overrideAiRecommendation(
        activeCase.id,
        overrideCareerId,
        overrideReason,
        'Dr. Anjali Deshmukh'
      );
      onUpdateCase(res);
      setOverrideReason('');
      alert('AI Recommendation successfully overridden with human counsellor professional justification.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Counsellor Desk Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-950/60 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-400/30">
              NCVET Certified Mentor Portal
            </span>
            <span className="text-xs text-emerald-200">• Human-in-the-Loop Safe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Vocational Counsellor Triage & Case Desk
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Welcome, <strong>Dr. Anjali Deshmukh</strong>. Monitor high-risk vocational dropouts, resolve family consensus conflicts, and exercise professional human override over AI recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
              Active Triage Queue
            </span>
            <span className="text-3xl font-black text-white block mt-0.5">
              {cases.length} Cases
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">
              4 Pending Mediation
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cases</span>
          <p className="text-xl font-black text-slate-900">{cases.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Family Conflicts</span>
          <p className="text-xl font-black text-amber-700">
            {cases.filter((c) => c.riskCategory === 'FAMILY_CONFLICT').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Low Confidence Gaps</span>
          <p className="text-xl font-black text-rose-700">
            {cases.filter((c) => c.riskCategory === 'LOW_EVIDENCE_CONFIDENCE').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Avg Mediation Time</span>
          <p className="text-xl font-black text-blue-700">38 Min</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Resolved Cases</span>
          <p className="text-xl font-black text-emerald-700">12 / 15</p>
        </div>
      </div>

      {/* Main Workspace: Left Queue + Right Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Case Queue List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">
              Assigned Cases Queue
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {filteredCases.length} Active
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['all', 'FAMILY_CONFLICT', 'LOW_EVIDENCE_CONFIDENCE', 'SMOOTH_ALIGNMENT'].map((rf) => (
              <button
                key={rf}
                onClick={() => setFilterRisk(rf)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer ${
                  filterRisk === rf
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {rf.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredCases.map((c) => {
              const isSelected = activeCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">
                      {c.learnerName}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        c.riskCategory === 'FAMILY_CONFLICT'
                          ? 'bg-amber-100 text-amber-800'
                          : c.riskCategory === 'LOW_EVIDENCE_CONFIDENCE'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.riskCategory}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Target Trade: {c.topCareerRecommendationId} • Confidence: {(c.overallConfidence * 100).toFixed(0)}%
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>Status: {c.status}</span>
                    <span className="text-blue-600 font-bold flex items-center gap-0.5">
                      Inspect Dossier <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Deep Case Inspector & Actions */}
        {activeCase && (
          <div className="lg:col-span-2 space-y-6">
            {/* Top Case Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">
                      Case Dossier: {activeCase.learnerName}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Case #{activeCase.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Phone: {activeCase.learnerPhone} • Parent: {activeCase.parentName || 'Suresh Sharma'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                    AI Confidence: {(activeCase.overallConfidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Target Trade Snapshot */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    AI Recommended Trade
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {activeTargetCareer.title[currentLanguage] || activeTargetCareer.title.en}
                  </span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    Sector: {activeTargetCareer.sector} • NSQF Level {activeTargetCareer.nsqfLevel}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Verified Salary Bracket
                  </span>
                  <span className="font-extrabold text-emerald-700 text-sm">
                    {activeTargetCareer.entryMonthlySalaryRange}/mo
                  </span>
                </div>
              </div>
            </div>

            {/* Human AI Override Panel (Crucial Requirement!) */}
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4 bg-gradient-to-b from-amber-50/20 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-700" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Human Counsellor Professional AI Override
                  </h3>
                </div>
                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Audit Logged
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                If psychometric, family geographical, or medical circumstances warrant overriding the AI model's choice, choose an alternative vocational role below with documented rationale.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Override Trade Choice:</label>
                  <select
                    value={overrideCareerId}
                    onChange={(e) => setOverrideCareerId(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs font-semibold rounded-xl p-2.5"
                  >
                    <option value="">Select Alternative Trade...</option>
                    {careers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title[currentLanguage] || c.title.en} (NSQF Level {c.nsqfLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Professional Justification:</label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Near-site solar training available; family supports green tech..."
                    className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="pt-1 flex justify-end">
                <button
                  onClick={handleOverrideAI}
                  disabled={!overrideCareerId || !overrideReason.trim() || isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Professional Human Override
                </button>
              </div>
            </div>

            {/* Counsellor Guidance Notes Recorder */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Case Guidance Notes & Family Mediation History</span>
              </h3>

              {/* Add Note Form */}
              <div className="space-y-2.5">
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record observations, mediation advice, or family commitments..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <input
                    type="text"
                    value={actionTaken}
                    onChange={(e) => setActionTaken(e.target.value)}
                    placeholder="Action taken (e.g., Scheduled joint call / Dispatched PLFS card)..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSubmitting}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    Add Case Note
                  </button>
                </div>
              </div>

              {/* Existing Notes History */}
              <div className="space-y-3 pt-2">
                {activeCase.counsellorNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-slate-700">{note.authorName}</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium text-[11px]">
                      {note.note}
                    </p>
                    {note.actionTaken && (
                      <p className="text-[10px] text-emerald-700 font-semibold pt-1">
                        Action: {note.actionTaken}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
