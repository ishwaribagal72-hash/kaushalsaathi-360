import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { AssessmentQuestion, LanguageCode, LearnerProfile } from '../types';
import { api } from '../utils/api';

interface AssessmentViewProps {
  questions: AssessmentQuestion[];
  learnerProfile: LearnerProfile;
  currentLanguage: LanguageCode;
  onAssessmentCompleted: (newScores: LearnerProfile['aptitudeScores']) => void;
  onNavigate: (view: string) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  questions,
  learnerProfile,
  currentLanguage,
  onAssessmentCompleted,
  onNavigate,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({
    'q-apt-01': 'opt-1a',
    'q-apt-02': 'opt-2a',
    'q-apt-03': 'opt-3d',
    'q-int-04': 'opt-4a',
    'q-int-05': 'opt-5a',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round((answeredCount / (questions.length || 1)) * 100);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));

      const result = await api.submitAssessment(learnerProfile.userId, answersPayload);
      if (result.scores) {
        onAssessmentCompleted(result.scores);
        setSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Psychometric & Practical Module
              </span>
              <span className="text-xs text-slate-400">• NSQF Aligned</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Vocational Aptitude & Interest Assessment
            </h1>
            <p className="text-xs text-slate-500">
              Assesses mechanical reasoning, spatial logic, practical aptitude, and environmental readiness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">
                {answeredCount} of {questions.length} Answered
              </p>
              <p className="text-[10px] text-slate-400">
                {progressPercent}% Complete
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 flex items-center justify-center font-black text-xs text-blue-700 bg-blue-50">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress line */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Success Notification if Submitted */}
      {submitted && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-extrabold text-emerald-900">
                Assessment Successfully Evaluated!
              </p>
              <p className="text-xs text-emerald-700">
                Your profile vectors have been updated with Practical 92% and Mechanical 88%.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>View New Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOptId = selectedAnswers[q.id];
          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                    {qIndex + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Domain: {q.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                      {q.question[currentLanguage] || q.question.en}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {q.options.map((opt) => {
                  const isSelected = selectedOptId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-2xs font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.text[currentLanguage] || opt.text.en}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-md flex items-center justify-between gap-4 sticky bottom-4">
        <div className="text-xs text-slate-500">
          Answers will be mathematically weighed into your 5-vector profile.
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('learner-dashboard')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Calibrating...' : 'Submit & Re-rank Recommendations'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
