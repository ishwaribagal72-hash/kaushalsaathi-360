import React, { useState } from 'react';
import {
  Compass,
  Users,
  ShieldCheck,
  Award,
  Bell,
  Mic,
  FileCode2,
  Globe,
  Sparkles,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { User, UserRole, LanguageCode, NotificationItem } from '../types';
import { t } from '../utils/i18n';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  availableUsers: User[];
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenVoice: () => void;
  onOpenArchDocs: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  availableUsers,
  currentLanguage,
  onLanguageChange,
  currentView,
  onNavigate,
  onOpenVoice,
  onOpenArchDocs,
  notifications,
  onMarkNotificationRead,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleBadgeColor: Record<UserRole, string> = {
    learner: 'bg-blue-100 text-blue-800 border-blue-200',
    parent: 'bg-amber-100 text-amber-800 border-amber-200',
    counsellor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Tri-Color Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 border-b border-slate-100" />

      {/* Top Notification / Govt Advisory Sub-header */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1 text-xs flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t(currentLanguage, 'govtAffiliation')}</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-orange-400 font-semibold">
            {t(currentLanguage, 'sihBadge')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenArchDocs}
            className="text-xs text-sky-300 hover:text-white flex items-center gap-1 transition-colors underline cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Architecture & SIH Specs</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-orange-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  KAUSHALSAATHI
                </span>
                <span className="bg-orange-500 text-white font-bold text-xs px-1.5 py-0.5 rounded-sm">
                  360
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                VOCATIONAL DECISION ENGINE
              </p>
            </div>
          </div>

          {/* Navigation Items (Role-Adaptive) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'landing'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {t(currentLanguage, 'navHome')}
            </button>

            {currentUser.role === 'learner' && (
              <>
                <button
                  onClick={() => onNavigate('learner-dashboard')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'learner-dashboard'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {t(currentLanguage, 'navDashboard')}
                </button>
                <button
                  onClick={() => onNavigate('assessment')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'assessment'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {t(currentLanguage, 'navAssessment')}
                </button>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'recommendations'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {t(currentLanguage, 'navRecommendations')}
                </button>
                <button
                  onClick={() => onNavigate('pathway-simulator')}
                  className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    currentView === 'pathway-simulator'
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {t(currentLanguage, 'navPathwaySimulator')}
                </button>
              </>
            )}

            {(currentUser.role === 'learner' || currentUser.role === 'parent') && (
              <button
                onClick={() => onNavigate('family-consensus')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'family-consensus'
                    ? 'bg-amber-50 text-amber-800 font-semibold ring-1 ring-amber-300'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Users className="w-4 h-4 text-amber-600" />
                <span>{t(currentLanguage, 'navFamilyConsensus')}</span>
              </button>
            )}

            {currentUser.role === 'counsellor' && (
              <button
                onClick={() => onNavigate('counsellor-desk')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'counsellor-desk'
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{t(currentLanguage, 'navCounsellor')}</span>
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin-panel')}
                className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'admin-panel'
                    ? 'bg-purple-50 text-purple-800 font-semibold'
                    : 'hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>{t(currentLanguage, 'navAdmin')}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('evidence-trust')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === 'evidence-trust'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'hover:bg-slate-100'
              }`}
            >
              {t(currentLanguage, 'navEvidenceTrust')}
            </button>
          </nav>

          {/* Right Action Controls: Voice, Language, Role Switcher, Notifications */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Voc-Saathi Voice Button */}
            <button
              onClick={onOpenVoice}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium text-xs rounded-full shadow-sm hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer animate-pulse-gentle"
              title="Speak with Voc-Saathi 360 AI Counsellor"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">
                {t(currentLanguage, 'voiceAssistant')}
              </span>
              <Sparkles className="w-3 h-3 text-amber-100" />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span className="uppercase">{currentLanguage}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {(['en', 'hi', 'mr'] as LanguageCode[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onLanguageChange(lang);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        currentLanguage === lang
                          ? 'text-blue-600 font-bold bg-blue-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>
                        {lang === 'en'
                          ? 'English'
                          : lang === 'hi'
                          ? 'हिंदी (Hindi)'
                          : 'मराठी (Marathi)'}
                      </span>
                      {currentLanguage === lang && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">
                      System Notifications
                    </span>
                    <span className="text-[10px] text-blue-600 font-medium">
                      {unreadCount} Unread
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onMarkNotificationRead(item.id)}
                          className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                            !item.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">
                              {item.title}
                            </span>
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Instant Role Switcher (Crucial for SIH Hackathon Jury Evaluation) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                  roleBadgeColor[currentUser.role]
                }`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <div className="text-left hidden sm:block">
                  <span className="block text-[11px] font-bold leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider opacity-80">
                    {t(currentLanguage, `role${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}`)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    SIH Demo: Switch Persona
                  </div>
                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors cursor-pointer ${
                        currentUser.id === u.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">
                            {u.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              roleBadgeColor[u.role]
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">
                          {u.email}
                        </p>
                      </div>
                    </button>
                  ))}
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                    <button
                      onClick={() => {
                        onNavigate('privacy');
                        setRoleMenuOpen(false);
                      }}
                      className="text-[11px] text-slate-600 hover:text-blue-600 font-medium cursor-pointer"
                    >
                      Privacy & DPDP Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
