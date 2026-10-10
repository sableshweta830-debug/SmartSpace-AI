import React, { useState } from 'react';
import { CheckSquare, Square, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { RecommendedAction } from '../../types';

interface RecommendedActionsWidgetProps {
  data?: any;
  actions?: RecommendedAction[];
  onGenerateBrief?: () => void;
}

export const RecommendedActionsWidget: React.FC<RecommendedActionsWidgetProps> = ({
  data,
  actions: propActions,
  onGenerateBrief,
}) => {
  const initialActions: RecommendedAction[] =
    propActions || data?.recommended_actions || data?.recommended_investigations || [];

  const [actions, setActions] = useState<RecommendedAction[]>(initialActions);

  React.useEffect(() => {
    if (propActions) {
      setActions(propActions);
    } else if (data?.recommended_actions) {
      setActions(data.recommended_actions);
    }
  }, [propActions, data?.recommended_actions]);

  const toggleAction = (id: string) => {
    setActions((prev) =>
      prev.map((act) =>
        act.id === id ? { ...act, completed: !act.completed } : act
      )
    );
  };

  const completedCount = actions.filter((a) => a.completed).length;

  return (
    <div className="w-full flex flex-col gap-3 text-xs">
      {/* Progress header */}
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
        <span>Completion Progress</span>
        <span className="font-semibold text-brand-600 dark:text-brand-400">
          {completedCount} / {actions.length} Completed
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-300"
          style={{ width: `${actions.length ? (completedCount / actions.length) * 100 : 0}%` }}
        />
      </div>

      {/* Action items list */}
      <div className="space-y-2 mt-1">
        {actions.map((action) => {
          if (action.action_type === 'button' || action.id === 'act_m_4') {
            return (
              <button
                key={action.id}
                onClick={onGenerateBrief}
                className="w-full p-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-950/40 hover:bg-brand-100/70 dark:hover:bg-brand-900/50 text-brand-700 dark:text-brand-300 font-semibold flex items-center justify-between transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>{action.title}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-700">
                  Generate Brief <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            );
          }

          return (
            <div
              key={action.id}
              onClick={() => toggleAction(action.id)}
              className={`p-3 rounded-xl border cursor-pointer select-none flex items-start gap-2.5 transition-all ${
                action.completed
                  ? 'border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 text-slate-400 dark:text-slate-500'
                  : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-300 text-slate-700 dark:text-slate-200'
              }`}
            >
              {action.completed ? (
                <CheckSquare className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
              ) : (
                <Square className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
              )}
              <span className={`leading-relaxed ${action.completed ? 'line-through' : 'font-medium'}`}>
                {action.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
