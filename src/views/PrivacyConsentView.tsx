import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
} from 'lucide-react';
import { ConsentSettings, User } from '../types';
import { api } from '../utils/api';

interface PrivacyConsentViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const PrivacyConsentView: React.FC<PrivacyConsentViewProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [consents, setConsents] = useState<ConsentSettings>({
    learnerProfileProcessing: true,
    shareWithGuardian: true,
    counsellorAccess: true,
    anonymizedResearchContribution: true,
    voiceAudioTranscriptionRetention: false,
    consentTimestamp: new Date().toISOString(),
  });
  const [saved, setSaved] = useState(false);
  const [deletedMsg, setDeletedMsg] = useState('');

  useEffect(() => {
    api.getConsent(currentUser.id).then((c) => {
      if (c) setConsents(c);
    });
  }, [currentUser.id]);

  const handleToggle = (key: keyof ConsentSettings) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    try {
      await api.updateConsent(currentUser.id, consents);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportData = () => {
    const exportData = {
      user: currentUser,
      consents,
      exportedAt: new Date().toISOString(),
      dpdpCompliance: 'India Digital Personal Data Protection Act 2023',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaushalsaathi-data-export-${currentUser.id}.json`;
    a.click();
  };

  const handleDeleteData = async () => {
    if (confirm('Are you sure you want to exercise your Right to be Forgotten? Your profile identifiers will be scheduled for permanent purge.')) {
      const res = await api.requestDataDeletion(currentUser.id);
      setDeletedMsg(res.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
            DPDP Act 2023 Compliant
          </span>
          <span className="text-xs text-slate-400">• Citizen Privacy Framework</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Privacy, Consent & Data Governance
        </h1>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          KaushalSaathi 360 enforces strict data minimization. We do not require Aadhaar identification for vocational exploration. You retain complete ownership of your psychometric and family records.
        </p>
      </div>

      {/* Granular Consent Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-extrabold text-slate-900">
          Granular Purpose-Specific Consent Toggles
        </h2>

        <div className="divide-y divide-slate-100 space-y-3">
          {[
            {
              key: 'learnerProfileProcessing' as const,
              title: '1. Vocational Profile & Psychometric Processing',
              desc: 'Required to compute skill matching, aptitude scores, and AI recommendations.',
            },
            {
              key: 'shareWithGuardian' as const,
              title: '2. Permitted Sharing with Linked Guardian',
              desc: 'Allows parent Suresh Sharma to view your recommended trades and contribute concerns.',
            },
            {
              key: 'counsellorAccess' as const,
              title: '3. NCVET Certified Counsellor Case Access',
              desc: 'Enables professional human counsellors to inspect your dossier when family conflicts occur.',
            },
            {
              key: 'anonymizedResearchContribution' as const,
              title: '4. Anonymized National Skill Gap Research',
              desc: 'Contributes de-identified regional skill data to improve MSDE vocational policy.',
            },
            {
              key: 'voiceAudioTranscriptionRetention' as const,
              title: '5. Voice Audio Sample Retention (Opt-In Only)',
              desc: 'Allow temporary speech recordings to improve local Hindi/Marathi phonetic transcription models.',
            },
          ].map((item) => (
            <div key={item.key} className="pt-3 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-xs text-slate-900 block">{item.title}</span>
                <span className="text-[11px] text-slate-500">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(consents[item.key])}
                onChange={() => handleToggle(item.key)}
                className="w-5 h-5 accent-blue-600 mt-1 cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Last Consent Timestamp: {new Date(consents.consentTimestamp).toLocaleString()}
          </span>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            {saved ? '✓ Saved Successfully' : 'Update Consent Settings'}
          </button>
        </div>
      </div>

      {/* Data Portability & Right to be Forgotten */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Data */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Data Portability (Export JSON)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Download a complete machine-readable copy of your psychometric assessment answers, career preferences, and consent history.
          </p>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export My Data</span>
          </button>
        </div>

        {/* Right to be Forgotten */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-3 bg-rose-50/20">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Right to be Forgotten (DPDP Section 12)
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Request permanent erasure of all personal profile identifiers and linked family cases from KaushalSaathi 360.
          </p>
          <button
            onClick={handleDeleteData}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Request Account Purge</span>
          </button>
        </div>
      </div>

      {deletedMsg && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
          {deletedMsg}
        </div>
      )}
    </div>
  );
};
