import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Calendar,
  Globe,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { EvidenceSource, EvidenceClaim, LanguageCode } from '../types';
import { api } from '../utils/api';

interface EvidenceExplorerViewProps {
  sources: EvidenceSource[];
  claims: EvidenceClaim[];
  currentLanguage: LanguageCode;
  onNavigate: (view: string) => void;
}

export const EvidenceExplorerView: React.FC<EvidenceExplorerViewProps> = ({
  sources,
  claims,
  currentLanguage,
  onNavigate,
}) => {
  const [sandboxQuery, setSandboxQuery] = useState('');
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [querying, setQuerying] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const handleTestEvidenceSandbox = async (queryText?: string) => {
    const q = queryText || sandboxQuery;
    if (!q.trim()) return;
    setQuerying(true);
    try {
      const res = await api.queryEvidence(q);
      setSandboxResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setQuerying(false);
    }
  };

  const filteredClaims = claims.filter((c) => {
    if (filterType === 'all') return true;
    if (filterType === 'UNKNOWN') return c.status === 'UNKNOWN';
    return c.claimType === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-950/50 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-400/30">
              Zero AI Hallucination Guardrail
            </span>
            <span className="text-xs text-emerald-200">• Truth Verification Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Evidence Trust Engine™
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Every factual wage, placement rate, safety score, and scheme entitlement is bound to a verified government source. When evidence does not exist, our AI strictly responds with <strong>UNKNOWN</strong>.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[170px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
            Verified Claims
          </span>
          <span className="text-3xl sm:text-4xl font-black text-white block mt-0.5">
            100%
          </span>
          <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">
            Gazette & PLFS Grounded
          </span>
        </div>
      </div>

      {/* Interactive Verification Sandbox (Test the UNKNOWN State!) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Interactive Verification Sandbox (Test Hallucination Defense)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Type any claim or query to see how the engine handles verified facts vs unbacked rumors.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={sandboxQuery}
            onChange={(e) => setSandboxQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTestEvidenceSandbox()}
            placeholder="e.g., 'Electrician salary', 'Solar job demand', or 'Drone pilot 10-year pension'..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleTestEvidenceSandbox()}
            disabled={querying || !sandboxQuery.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            {querying ? 'Verifying...' : 'Query Evidence Base'}
          </button>
        </div>

        {/* Demo Preset Buttons to Test */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400">Try Presets:</span>
          <button
            onClick={() => {
              setSandboxQuery('electrician starting salary');
              handleTestEvidenceSandbox('electrician starting salary');
            }}
            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-[11px] font-medium text-slate-700 cursor-pointer"
          >
            "Electrician starting salary" (Verified)
          </button>
          <button
            onClick={() => {
              setSandboxQuery('drone pilot long term 10-year pension');
              handleTestEvidenceSandbox('drone pilot long term 10-year pension');
            }}
            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-[11px] font-semibold cursor-pointer border border-rose-200"
          >
            "Drone pilot 10-year pension" (Triggers UNKNOWN)
          </button>
        </div>

        {/* Sandbox Output Banner */}
        {sandboxResult && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              sandboxResult.status === 'VERIFIED'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold uppercase text-[11px] flex items-center gap-1.5">
                {sandboxResult.status === 'VERIFIED' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>STATUS: VERIFIED BY STATUTORY RECORD</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>STATUS: UNKNOWN (ABSTENTION ENFORCED)</span>
                  </>
                )}
              </span>
              <span className="text-[10px] font-bold bg-white/80 px-2 py-0.5 rounded">
                Anti-Hallucination Safe
              </span>
            </div>

            <p className="leading-relaxed font-medium">
              {sandboxResult.message || sandboxResult.claims?.[0]?.claimStatement.en}
            </p>

            {sandboxResult.claims?.[0] && (
              <div className="pt-1 text-[11px] font-bold">
                Metric: {sandboxResult.claims[0].metricValue} • Confidence: {(sandboxResult.claims[0].confidence * 100).toFixed(0)}%
              </div>
            )}
          </div>
        )}
      </div>

      {/* Official Sources Registry */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            Publishing Authority & Gazette Registry
          </h2>
          <p className="text-xs text-slate-500">
            Statutory agencies publishing empirical labour, wage, and skill standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src) => (
            <div
              key={src.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200">
                  {src.type}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {(src.confidenceScore * 100).toFixed(0)}% Confidence
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                  {src.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Authority: {src.publishingAuthority}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600">
                <div>
                  <span className="font-semibold block text-slate-400 text-[10px]">Publication Date</span>
                  <span>{src.publicationDate}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-400 text-[10px]">Last Audited</span>
                  <span>{src.lastVerifiedDate}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/50">
                  <span className="font-semibold text-slate-400 text-[10px] block">Geography</span>
                  <span>{src.geography}</span>
                </div>
              </div>

              <div className="text-[11px] text-blue-600 font-medium truncate">
                Citation: {src.urlOrCitation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Claims Catalogue with Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Verified Claims Knowledge Base
            </h3>
            <p className="text-xs text-slate-500">
              Curated ground-truth claims used by the recommendation pipeline and Voc-Saathi RAG.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'SALARY_RANGE', 'SAFETY_RATING', 'JOB_GROWTH', 'UNKNOWN'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1 rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer ${
                  filterType === f
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                claim.status === 'VERIFIED'
                  ? 'bg-white border-slate-200 hover:border-emerald-300'
                  : 'bg-rose-50/50 border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    claim.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-200 text-rose-900 font-black'
                  }`}
                >
                  {claim.status} • {claim.claimType}
                </span>

                <span className="text-[10px] font-bold text-slate-500">
                  Confidence: {(claim.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <p className="text-slate-800 leading-relaxed font-medium">
                {claim.claimStatement[currentLanguage] || claim.claimStatement.en}
              </p>

              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-900">
                  Metric: {claim.metricValue}
                </span>
                <span className="text-slate-400">
                  Source: {claim.evidenceSourceId}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
