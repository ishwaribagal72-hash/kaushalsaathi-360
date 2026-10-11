/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';

import { LandingPage } from './views/LandingPage';
import { LearnerDashboard } from './views/LearnerDashboard';
import { AssessmentView } from './views/AssessmentView';
import { RecommendationView } from './views/RecommendationView';
import { CareerDetailView } from './views/CareerDetailView';
import { CareerCompareView } from './views/CareerCompareView';
import { PathwaySimulatorView } from './views/PathwaySimulatorView';
import { FamilyConsensusView } from './views/FamilyConsensusView';
import { EvidenceExplorerView } from './views/EvidenceExplorerView';
import { ActionPlanView } from './views/ActionPlanView';
import { CounsellorDashboardView } from './views/CounsellorDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { PrivacyConsentView } from './views/PrivacyConsentView';

import {
  INITIAL_USERS,
  INITIAL_LEARNER_PROFILE,
  CAREER_ROLES,
  EVIDENCE_SOURCES,
  EVIDENCE_CLAIMS,
  ASSESSMENT_QUESTIONS,
  INITIAL_FAMILY_CASE,
  INITIAL_COUNSELLOR_CASES,
  INITIAL_ACTION_PLAN,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  SYSTEM_ANALYTICS,
} from './data/mockVocationalData';

import {
  User,
  LanguageCode,
  LearnerProfile,
  CareerRole,
  CareerRecommendation,
  FamilyConsensusCase,
  CounsellorCase,
  ActionPlan,
  AuditLog,
  NotificationItem,
  SystemAnalytics,
} from './types';
import { api } from './utils/api';

export default function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedCareerId, setSelectedCareerId] = useState<string>('car-elec-01');

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isArchDocsModalOpen, setIsArchDocsModalOpen] = useState<boolean>(false);

  // Core Data Stores
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [profile, setProfile] = useState<LearnerProfile>(INITIAL_LEARNER_PROFILE);
  const [careers, setCareers] = useState<CareerRole[]>(CAREER_ROLES);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [familyCase, setFamilyCase] = useState<FamilyConsensusCase>(INITIAL_FAMILY_CASE);
  const [counsellorCases, setCounsellorCases] = useState<CounsellorCase[]>(INITIAL_COUNSELLOR_CASES);
  const [actionPlan, setActionPlan] = useState<ActionPlan>(INITIAL_ACTION_PLAN);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [analytics, setAnalytics] = useState<SystemAnalytics>(SYSTEM_ANALYTICS);

  // Initialize data from API
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [careersRes, recRes, famRes, cnsRes, planRes, audRes, ntfRes, anaRes] = await Promise.all([
        api.getCareers().catch(() => CAREER_ROLES),
        api.getRecommendations('usr-learner-01').catch(() => ({ recommendations: [] })),
        api.getFamilyCase('usr-learner-01').catch(() => INITIAL_FAMILY_CASE),
        api.getCounsellorCases().catch(() => INITIAL_COUNSELLOR_CASES),
        api.getActionPlan('usr-learner-01').catch(() => INITIAL_ACTION_PLAN),
        api.getAuditLogs().catch(() => INITIAL_AUDIT_LOGS),
        api.getNotifications('usr-learner-01').catch(() => INITIAL_NOTIFICATIONS),
        api.getAnalytics().catch(() => SYSTEM_ANALYTICS),
      ]);

      if (careersRes) setCareers(careersRes);
      if (recRes?.recommendations?.length) {
        setRecommendations(recRes.recommendations);
      } else {
        // Fallback recommendations if offline
        generateFallbackRecommendations(careersRes || CAREER_ROLES);
      }
      if (famRes) setFamilyCase(famRes);
      if (cnsRes) setCounsellorCases(cnsRes);
      if (planRes) setActionPlan(planRes);
      if (audRes) setAuditLogs(audRes);
      if (ntfRes) setNotifications(ntfRes);
      if (anaRes) setAnalytics(anaRes);
    } catch (err) {
      console.warn('Backend loading had minor error, loaded seeded initial dataset.', err);
      generateFallbackRecommendations(CAREER_ROLES);
    }
  };

  const generateFallbackRecommendations = (careersList: CareerRole[]) => {
    const recs: CareerRecommendation[] = careersList.map((c, i) => ({
      careerId: c.id,
      career: c,
      overallFitScore: Math.max(70, 94 - i * 4),
      confidenceScore: 0.92,
      whyBreakdown: {
        interestMatch: 88,
        skillMatch: 84,
        locationFeasibility: 90,
        trainingAvailability: 88,
        familyAlignment: 76,
        evidenceConfidence: 'HIGH',
        keyReasons: [
          `Strong mechanical and practical aptitude correlation.`,
          `Government ITI and PMKK centres operational in district.`,
          `Verified wage growth per MoSPI PLFS reports.`,
        ],
      },
      humanEscalationRequired: false,
    }));
    setRecommendations(recs);
  };

  // Switch role handler (Instant persona switch for SIH Hackathon Jury)
  const handleSwitchUser = (newUser: User) => {
    setCurrentUser(newUser);
    // Route to appropriate initial dashboard for that persona
    if (newUser.role === 'learner') {
      setCurrentView('learner-dashboard');
    } else if (newUser.role === 'parent') {
      setCurrentView('family-consensus');
    } else if (newUser.role === 'counsellor') {
      setCurrentView('counsellor-desk');
    } else if (newUser.role === 'admin') {
      setCurrentView('admin-panel');
    }
  };

  const handleAssessmentCompleted = (newScores: any) => {
    setProfile((prev) => ({ ...prev, aptitudeScores: newScores }));
    api.getRecommendations(currentUser.id).then((res) => {
      if (res?.recommendations) setRecommendations(res.recommendations);
    });
  };

  const handleMarkNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await api.markNotificationRead(id);
    } catch (e) {
      console.error(e);
    }
  };

  const currentCareer = careers.find((c) => c.id === selectedCareerId) || careers[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 font-sans text-slate-900 antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        availableUsers={users}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenArchDocs={() => setIsArchDocsModalOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            currentLanguage={currentLanguage}
            onNavigate={setCurrentView}
            onSwitchUser={handleSwitchUser}
            availableUsers={users}
            analytics={analytics}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentView === 'learner-dashboard' && (
          <LearnerDashboard
            profile={profile}
            recommendations={recommendations}
            familyCase={familyCase}
            actionPlan={actionPlan}
            currentLanguage={currentLanguage}
            onNavigate={setCurrentView}
            onSelectCareer={setSelectedCareerId}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentView
            questions={ASSESSMENT_QUESTIONS}
            learnerProfile={profile}
            currentLanguage={currentLanguage}
            onAssessmentCompleted={handleAssessmentCompleted}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'recommendations' && (
          <RecommendationView
            recommendations={recommendations}
            currentLanguage={currentLanguage}
            onSelectCareer={setSelectedCareerId}
            onNavigate={setCurrentView}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentView === 'career-details' && (
          <CareerDetailView
            career={currentCareer}
            claims={EVIDENCE_CLAIMS}
            currentLanguage={currentLanguage}
            onNavigate={setCurrentView}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentView === 'career-compare' && (
          <CareerCompareView
            careers={careers}
            currentLanguage={currentLanguage}
            onNavigate={setCurrentView}
            onSelectCareer={setSelectedCareerId}
          />
        )}

        {currentView === 'pathway-simulator' && (
          <PathwaySimulatorView
            careers={careers}
            selectedCareerId={selectedCareerId}
            onSelectCareer={setSelectedCareerId}
            currentLanguage={currentLanguage}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'family-consensus' && (
          <FamilyConsensusView
            familyCase={familyCase}
            careers={careers}
            currentLanguage={currentLanguage}
            onUpdateCase={setFamilyCase}
            onNavigate={setCurrentView}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
          />
        )}

        {currentView === 'evidence-trust' && (
          <EvidenceExplorerView
            sources={EVIDENCE_SOURCES}
            claims={EVIDENCE_CLAIMS}
            currentLanguage={currentLanguage}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'action-plan' && (
          <ActionPlanView
            actionPlan={actionPlan}
            currentLanguage={currentLanguage}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'counsellor-desk' && (
          <CounsellorDashboardView
            cases={counsellorCases}
            careers={careers}
            currentLanguage={currentLanguage}
            onUpdateCase={(updatedCase) => {
              setCounsellorCases((prev) =>
                prev.map((c) => (c.id === updatedCase.id ? updatedCase : c))
              );
            }}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'admin-panel' && (
          <AdminDashboardView
            auditLogs={auditLogs}
            evidenceClaims={EVIDENCE_CLAIMS}
            users={users}
            analytics={analytics}
            onRefreshData={loadInitialData}
          />
        )}

        {currentView === 'privacy' && (
          <PrivacyConsentView
            currentUser={currentUser}
            onNavigate={setCurrentView}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onNavigate={setCurrentView}
        onOpenArchDocs={() => setIsArchDocsModalOpen(true)}
      />

      {/* Floating Voc-Saathi AI Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-white ring-4 ring-orange-400/20"
          title="Talk with Voc-Saathi 360 AI"
        >
          <span className="sr-only">Voice AI</span>
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </button>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        learnerId={currentUser.role === 'learner' ? currentUser.id : 'usr-learner-01'}
      />

      {/* SIH System Architecture & Specifications Modal */}
      <SystemArchitectureModal
        isOpen={isArchDocsModalOpen}
        onClose={() => setIsArchDocsModalOpen(false)}
      />
    </div>
  );
}
