import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Trash2,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Clock,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { TaskItem, WorkspaceResponse } from '../types';
import { api } from '../services/api';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';

interface TaskHistoryPageProps {
  onLoadWorkspace: (workspace: WorkspaceResponse) => void;
}

export const TaskHistoryPage: React.FC<TaskHistoryPageProps> = ({ onLoadWorkspace }) => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await api.getHistory();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load task history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleOpenTask = async (taskId: number) => {
    try {
      const details = await api.getTaskDetails(taskId);
      if (details.configuration) {
        // Build workspace response
        const workspaceResp: WorkspaceResponse = {
          task_id: details.task.id,
          task_title: details.task.title,
          intent: details.task.detected_intent,
          confidence: details.configuration.confidence || 0.9,
          summary: details.configuration.summary,
          widgets: details.configuration.widgets,
          widget_data: details.widget_data,
          recommended_actions: details.configuration.recommended_actions || [],
          explanation: details.configuration.explanation,
          explanations_per_widget: details.configuration.explanations_per_widget || {},
          is_fallback: true,
          data_source: details.configuration.data_source || 'Demo Data',
          available_info: details.configuration.available_info || [],
          missing_info: details.configuration.missing_info || [],
          recommended_next_step: details.configuration.recommended_next_step || '',
          workspace_configuration: details.configuration,
        };

        onLoadWorkspace(workspaceResp);
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to reopen task workspace:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task from database history?')) return;
    try {
      setDeletingId(taskId);
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <History className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Task History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Persistent log of submitted intent prompts and generated workspace configurations.
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Log
        </button>
      </div>

      {/* Task List */}
      {isLoading ? (
        <LoadingState message="Loading database task history..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No Tasks in History"
          description="Submit a goal from the command bar on the home dashboard to generate adaptive workspace configurations."
          actionText="Go to Dashboard"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-800 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                    {task.detected_intent.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(task.created_at).toLocaleString()}
                  </span>
                  {task.is_saved && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Saved
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {task.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  &quot;{task.original_prompt}&quot;
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => handleOpenTask(task.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Workspace</span>
                </button>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={deletingId === task.id}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete task from database"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
