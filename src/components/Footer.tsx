import React from 'react';
import { Compass, PhoneCall, ShieldCheck, ExternalLink, FileCode2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { t } from '../utils/i18n';

interface FooterProps {
  currentLanguage: LanguageCode;
  onNavigate: (view: string) => void;
  onOpenArchDocs: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLanguage,
  onNavigate,
  onOpenArchDocs,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Helpline Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                National Vocational Counselling Helpline (Toll-Free)
              </p>
              <p className="text-sm font-bold text-white tracking-wide">
                14422 / 1800-123-9626 (Skill India Digital Portal)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://ncvet.gov.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>NCVET Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://apprenticeshipindia.gov.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <span>NAPS Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={onOpenArchDocs}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>SIH Technical Architecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                KAUSHALSAATHI 360
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t(currentLanguage, 'tagline')}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Evidence Trust Engine™: Zero AI Hallucination Guardrail</span>
            </div>
          </div>

          {/* Col 2: Stakeholder Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Role Workspaces
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('learner-dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Learner Career Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('family-consensus')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Parent & Family Consensus Meter
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('counsellor-desk')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Counsellor Triage & Case Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-panel')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Governance & Audit Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Engines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Decision Support Engines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  5-Vector Recommendation Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pathway-simulator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  3-Pathway Multi-Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('evidence-trust')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  NCVET & PLFS Evidence Registry
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  DPDP Act 2023 Consent Manager
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Hackathon Attribution */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              SIH Project Attribution
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Developed for <strong>Smart India Hackathon (SIH26241)</strong>:
              AI-Enabled Career Counselling and Family Decision-Support Platform for Vocational Education.
            </p>
            <div className="text-[11px] text-slate-400 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700">
              <span className="font-semibold text-orange-400">Anti-Guarantee Notice: </span>
              AI recommendations provide decision support based on historical statistical evidence and do not guarantee wage or admission outcomes.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 KAUSHALSAATHI 360. All Government Data Grounded & Protected.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <span>•</span>
            <button
              onClick={onOpenArchDocs}
              className="text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
            >
              Architecture & API Specs
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
