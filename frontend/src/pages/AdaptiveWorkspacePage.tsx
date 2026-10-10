import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  Eye,
  Layers,
  CheckCircle2,
  Cpu,
  Info,
} from 'lucide-react';
import { WorkspaceResponse, WidgetConfig } from '../types';
import { RenderWidget } from '../components/widgets/WidgetRegistry';
import { ExplanationPanel } from '../components/widgets/ExplanationPanel';
import { MeetingBriefModal } from '../components/common/MeetingBriefModal';
import { api } from '../services/api';

interface AdaptiveWorkspacePageProps {
  workspace: WorkspaceResponse;
  onResetLayout?: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

export const AdaptiveWorkspacePage: React.FC<AdaptiveWorkspacePageProps> = ({
  workspace,
  onResetLayout,
  onSelectPrompt,
}) => {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(workspace.widgets || []);
  const [isSaved, setIsSaved] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [showExplanationPanel, setShowExplanationPanel] = useState(true);

  // Sync when workspace prop changes
  React.useEffect(() => {
    setWidgets(workspace.widgets || []);
  }, [workspace]);

  const handleHideWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, hidden: true } : w))
    );
  };

  const handleRestoreWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, hidden: false } : w))
    );
  };

  const handleRestoreAll = () => {
    setWidgets((prev) => prev.map((w) => ({ ...w, hidden: false })));
  };

  const handleToggleSave = async () => {
    if (workspace.task_id) {
      try {
        const nextState = !isSaved;
        await api.updateTask(workspace.task_id, { is_saved: nextState });
        setIsSaved(nextState);
      } catch (e) {
        console.error('Failed to toggle saved workspace:', e);
      }
    } else {
      setIsSaved(!isSaved);
    }
  };

  const hiddenWidgets = widgets.filter((w) => w.hidden);
  const visibleWidgets = widgets.filter((w) => !w.hidden);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Workspace Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
              {workspace.intent.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Confidence: {Math.round(workspace.confidence * 100)}%
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400 font-mono">
              Engine: {workspace.is_fallback ? 'Rule-Based Semantic Classifier' : 'AI LLM API'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {workspace.task_title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            {workspace.summary}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => setShowExplanationPanel(!showExplanationPanel)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              showExplanationPanel
                ? 'bg-brand-50 border-brand-300 text-brand-700 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Why this workspace?</span>
          </button>

          <button
            onClick={handleToggleSave}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              isSaved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved' : 'Save Workspace'}</span>
          </button>

          {onResetLayout && (
            <button
              onClick={() => {
                handleRestoreAll();
                onResetLayout();
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Reset workspace layout"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Hidden Widgets Restore Bar */}
      {hiddenWidgets.length > 0 && (
        <div className="p-3 px-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">Hidden Widgets ({hiddenWidgets.length}):</span>
            {hiddenWidgets.map((w) => (
              <button
                key={w.id}
                onClick={() => handleRestoreWidget(w.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 text-[11px] font-medium hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              >
                <Eye className="w-3 h-3" />
                <span>Restore {w.title}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleRestoreAll}
            className="text-[11px] font-bold underline hover:text-amber-700 shrink-0"
          >
            Restore All
          </button>
        </div>
      )}

      {/* AI Explanation Panel ("Why this workspace?") */}
      {showExplanationPanel && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Why this workspace was selected for your goal:
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">
              Task ID #{workspace.task_id || 'new'}
            </span>
          </div>

          <ExplanationPanel
            intent={workspace.intent}
            confidence={workspace.confidence}
            explanation={workspace.explanation}
            explanationsPerWidget={workspace.explanations_per_widget}
            availableInfo={workspace.available_info}
            missingInfo={workspace.missing_info}
            recommendedNextStep={workspace.recommended_next_step}
            isFallback={workspace.is_fallback}
          />
        </div>
      )}

      {/* Dynamic Adaptive Widget Grid */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {visibleWidgets.map((widgetConfig) => {
          // Pass the specific data subset or the whole widget_data payload
          const specificData =
            workspace.widget_data[widgetConfig.id] ||
            workspace.widget_data[widgetConfig.type] ||
            workspace.widget_data;

          const explanation =
            workspace.explanations_per_widget[widgetConfig.id] ||
            widgetConfig.description;

          return (
            <RenderWidget
              key={widgetConfig.id}
              config={widgetConfig}
              data={specificData}
              explanation={explanation}
              onHide={handleHideWidget}
              onGenerateBrief={() => setShowBriefModal(true)}
            />
          );
        })}
      </div>

      {/* Meeting Brief Modal */}
      <MeetingBriefModal
        isOpen={showBriefModal}
        onClose={() => setShowBriefModal(false)}
        clientData={workspace.widget_data}
      />
    </div>
  );
};
