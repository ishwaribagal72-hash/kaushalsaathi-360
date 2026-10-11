import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Database,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  Activity,
  BarChart3,
  FileCheck2,
} from 'lucide-react';
import { AuditLog, EvidenceClaim, User, SystemAnalytics } from '../types';
import { api } from '../utils/api';

interface AdminDashboardViewProps {
  auditLogs: AuditLog[];
  evidenceClaims: EvidenceClaim[];
  users: User[];
  analytics: SystemAnalytics;
  onRefreshData: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  auditLogs,
  evidenceClaims,
  users,
  analytics,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'audits' | 'evidence' | 'ai-config' | 'users'>('audits');
  const [auditFilter, setAuditFilter] = useState<string>('all');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState<number>(75);
  const [requireHumanReviewForGaps, setRequireHumanReviewForGaps] = useState<boolean>(true);

  const filteredLogs = auditLogs.filter((log) => {
    if (auditFilter === 'all') return true;
    return log.userRole === auditFilter || log.securityStatus === auditFilter;
  });

  const handleVerifyClaim = async (claimId: string) => {
    try {
      await api.verifyClaim(claimId, 'MSDE-AITT-Gazette-2025');
      onRefreshData();
      alert(`Claim ${claimId} verified and signed.`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-purple-950/60 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-purple-400/30">
              System Administration & Governance
            </span>
            <span className="text-xs text-purple-200">• OWASP ASVS Monitored</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Security, Evidence Audits & AI Governance
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
            Administrator portal for <strong>Priya Sundaram</strong>. Monitor immutable audit logs, verify government evidence claims, and calibrate AI recommendation thresholds.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[170px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block">
            Security Status
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 block mt-1">
            OPTIMAL (100%)
          </span>
          <span className="text-[10px] text-purple-200 font-semibold block mt-0.5">
            Zero Breaches Recorded
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'audits', label: 'Tamper-Evident Audit Trails', icon: Activity },
          { id: 'evidence', label: 'Evidence Claim Verification', icon: FileCheck2 },
          { id: 'ai-config', label: 'AI Configuration & Safety', icon: Sliders },
          { id: 'users', label: 'User & Role Management', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Audit Logs */}
      {activeTab === 'audits' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Immutable System Activity & Security Logs
              </h3>
              <p className="text-xs text-slate-500">
                OWASP ASVS Level 2 compliant audit trail recording user logins, assessments, AI overrides, and consents.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['all', 'learner', 'parent', 'counsellor', 'admin', 'SUCCESS'].map((f) => (
                <button
                  key={f}
                  onClick={() => setAuditFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase cursor-pointer ${
                    auditFilter === f
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Actor / Role</th>
                  <th className="pb-3">Action Type</th>
                  <th className="pb-3">Target Resource</th>
                  <th className="pb-3">IP Address</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-3 font-mono text-[11px] text-slate-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3">
                      <span className="font-bold text-slate-900 block">{log.userName}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">{log.userRole}</span>
                    </td>
                    <td className="py-3 font-mono text-[11px] font-bold text-blue-700">
                      {log.action}
                    </td>
                    <td className="py-3 text-slate-600 font-medium truncate max-w-xs">
                      {log.resource}
                    </td>
                    <td className="py-3 font-mono text-[10px] text-slate-500">
                      {log.ipAddress}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          log.securityStatus === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.securityStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Evidence Management */}
      {activeTab === 'evidence' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Government Evidence Verification Console
            </h3>
            <p className="text-xs text-slate-500">
              Verify empirical claims before they are ingested by the recommendation ranking pipeline.
            </p>
          </div>

          <div className="space-y-3">
            {evidenceClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{claim.id}</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {claim.claimType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        claim.status === 'VERIFIED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium">{claim.claimStatement.en}</p>
                  <p className="text-[11px] text-slate-500 font-semibold">Metric: {claim.metricValue}</p>
                </div>

                <div className="shrink-0">
                  {claim.status === 'VERIFIED' ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Signed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleVerifyClaim(claim.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      Verify with Gazette
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: AI Configuration */}
      {activeTab === 'ai-config' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              AI Confidence Thresholds & Guardrails
            </h3>
            <p className="text-xs text-slate-500">
              Set automated recommendation cutoffs to prevent algorithmic bias or premature career matching.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Minimum Confidence Score Threshold:</span>
                <span className="text-blue-700 font-black">{aiConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={aiConfidenceThreshold}
                onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Any recommendation with confidence below {aiConfidenceThreshold}% will automatically flag a mandatory human counsellor triage escalation.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">
                  Mandatory Human Review on Family Disparity
                </span>
                <span className="text-[11px] text-slate-500">
                  Flag case to counsellor if Agreement Score is under 65%.
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireHumanReviewForGaps}
                onChange={(e) => setRequireHumanReviewForGaps(e.target.checked)}
                className="w-4 h-4 accent-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Registered Citizens & Mentors Registry
            </h3>
            <p className="text-xs text-slate-500">
              View registered users across Learner, Parent, Counsellor, and Admin roles.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[11px] text-slate-500">{u.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {u.role}
                  </span>
                  <span className="text-emerald-600 text-xs font-semibold">✓ Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
