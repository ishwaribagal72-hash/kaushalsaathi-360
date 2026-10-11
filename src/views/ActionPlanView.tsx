import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Share2,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import { ActionPlan, ActionPlanMilestone, LanguageCode } from '../types';
import { api } from '../utils/api';

interface ActionPlanViewProps {
  actionPlan: ActionPlan;
  currentLanguage: LanguageCode;
  onNavigate: (view: string) => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  actionPlan,
  currentLanguage,
  onNavigate,
}) => {
  const [milestones, setMilestones] = useState<ActionPlanMilestone[]>(actionPlan.milestones);

  const toggleMilestone = async (id: string, currentState: boolean) => {
    const newState = !currentState;
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: newState } : m))
    );
    try {
      await api.toggleMilestone(id, newState);
    } catch (e) {
      console.error(e);
    }
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / (milestones.length || 1)) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Action Plan Roadmap
            </span>
            <span className="text-xs text-slate-400">• Certified Milestone Execution</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Personal Action Plan: {actionPlan.careerTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {actionPlan.selectedPathway} • Estimated Target Horizon: {actionPlan.targetCompletionMonths} Months
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Roadmap</span>
          </button>
        </div>
      </div>

      {/* Progress Metric Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-700">Roadmap Completion Rate</span>
            <p className="text-xl font-black text-emerald-700">
              {progressPercent}% Complete ({completedCount} of {milestones.length} Milestones)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                actionPlan.counsellorApproved
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {actionPlan.counsellorApproved ? '✓ Counsellor Approved' : 'Pending Review'}
            </span>
          </div>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Milestones Vertical Timeline */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">
          Sequential Action Plan Milestones
        </h2>

        <div className="space-y-4">
          {milestones.map((ms, idx) => (
            <div
              key={ms.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex items-start gap-4 ${
                ms.completed
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Checkbox Trigger */}
              <button
                onClick={() => toggleMilestone(ms.id, ms.completed)}
                className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  ms.completed
                    ? 'bg-emerald-600 text-white'
                    : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                }`}
              >
                {ms.completed && <CheckCircle2 className="w-4 h-4" />}
              </button>

              {/* Milestone Details */}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Step {idx + 1} • {ms.category}
                    </span>
                    <h3
                      className={`font-bold text-sm leading-snug ${
                        ms.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                      }`}
                    >
                      {ms.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-100 shrink-0">
                    Target Date: {ms.targetDate}
                  </span>
                </div>

                {ms.notes && (
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {ms.notes}
                  </p>
                )}

                {ms.portalLink && (
                  <div className="pt-1">
                    <a
                      href={ms.portalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <span>Direct Portal Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
