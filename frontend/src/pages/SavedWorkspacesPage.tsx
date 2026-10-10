import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, ExternalLink, BookmarkX, Clock, Layers } from 'lucide-react';
import { TaskItem, WorkspaceResponse } from '../types';
import { api } from '../services/api';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingState } from '../components/common/LoadingState';

interface SavedWorkspacesPageProps {
  onLoadWorkspace: (workspace: WorkspaceResponse) => void;
}

export const SavedWorkspacesPage: React.FC<SavedWorkspacesPageProps> = ({ onLoadWorkspace }) => {
  const [savedTasks, setSavedTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadSaved = async () => {
    try {
      setIsLoading(true);
      const data = await api.getTasks(true);
      setSavedTasks(data);
    } catch (err) {
      console.error('Failed to load saved workspaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleOpenWorkspace = async (taskId: number) => {
    try {
      const details = await api.getTaskDetails(taskId);
      if (details.configuration) {
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
      console.error('Failed to reopen saved workspace:', err);
    }
  };

  const handleUnsave = async (taskId: number) => {
    try {
      await api.updateTask(taskId, { is_saved: false });
      setSavedTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error('Failed to unsave workspace:', err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Bookmark className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Saved Workspaces
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quickly access pinned workspace configurations bookmarked during previous sessions.
        </p>
      </div>

      {isLoading ? (
        <LoadingState message="Fetching saved workspaces..." />
      ) : savedTasks.length === 0 ? (
        <EmptyState
          title="No Saved Workspaces"
          description="When you generate a workspace, click the 'Save Workspace' button in the header to bookmark it here for fast recall."
          actionText="Create a Workspace"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-900">
                    {task.detected_intent.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {task.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  &quot;{task.original_prompt}&quot;
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleUnsave(task.id)}
                  className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                >
                  <BookmarkX className="w-3.5 h-3.5" />
                  <span>Remove Bookmark</span>
                </button>

                <button
                  onClick={() => handleOpenWorkspace(task.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Reopen</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
