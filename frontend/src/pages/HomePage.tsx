import React, { useState, useEffect } from 'react';
import { CommandBar } from '../components/dashboard/CommandBar';
import { DemoTaskBar } from '../components/dashboard/DemoTaskBar';
import { DefaultDashboard } from '../components/dashboard/DefaultDashboard';
import { AdaptiveWorkspacePage } from './AdaptiveWorkspacePage';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { api } from '../services/api';
import { WorkspaceResponse, DefaultDashboardData } from '../types';
import { LayoutDashboard, Sparkles, RefreshCw } from 'lucide-react';

interface HomePageProps {
  onWorkspaceChange?: (workspace: WorkspaceResponse | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onWorkspaceChange }) => {
  const [defaultData, setDefaultData] = useState<DefaultDashboardData | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  // Fetch initial default dashboard data
  useEffect(() => {
    const loadDefault = async () => {
      try {
        const data = await api.getDefaultDashboard();
        setDefaultData(data);
      } catch (err: any) {
        console.error('Failed to load default dashboard:', err);
        setError(err.message || 'Unable to connect to backend server');
      }
    };
    loadDefault();
  }, []);

  const handleGenerateWorkspace = async (promptText: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPrompt(promptText);

      const response = await api.generateWorkspace(promptText, true);
      setActiveWorkspace(response);
      if (onWorkspaceChange) {
        onWorkspaceChange(response);
      }
    } catch (err: any) {
      console.error('Failed to generate workspace:', err);
      setError(err.message || 'Error communicating with workspace engine');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = () => {
    setActiveWorkspace(null);
    setCurrentPrompt('');
    if (onWorkspaceChange) {
      onWorkspaceChange(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Intelligent Command Bar Section */}
      <div className="flex flex-col gap-4">
        <CommandBar
          onSubmit={handleGenerateWorkspace}
          isLoading={isLoading}
          initialValue={currentPrompt}
        />

        {/* Hackathon Demo Quick Switcher */}
        <DemoTaskBar
          onSelectScenario={handleGenerateWorkspace}
          currentIntent={activeWorkspace?.intent}
          hasLoadedWorkspace={!!activeWorkspace}
          widgetCount={activeWorkspace?.widgets?.length}
        />
      </div>

      {/* Mode Switcher / Reset to Home banner when workspace is active */}
      {activeWorkspace && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span>
              Adaptive mode active for prompt: <strong className="text-slate-900 dark:text-slate-100">&quot;{currentPrompt}&quot;</strong>
            </span>
          </div>

          <button
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-brand-500" />
            <span>Return to Default Dashboard</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingState
          message="Analyzing goal & building layout..."
          submessage="Evaluating intent classification and selecting optimal widget arrangement"
        />
      ) : error ? (
        <ErrorState
          title="Could not configure workspace"
          message={error}
          onRetry={() => handleGenerateWorkspace(currentPrompt || "Prepare for tomorrow's client meeting.")}
        />
      ) : activeWorkspace ? (
        <AdaptiveWorkspacePage
          workspace={activeWorkspace}
          onResetLayout={() => handleGenerateWorkspace(currentPrompt)}
          onSelectPrompt={handleGenerateWorkspace}
        />
      ) : defaultData ? (
        <DefaultDashboard
          data={defaultData}
          onSelectPrompt={handleGenerateWorkspace}
        />
      ) : (
        <LoadingState message="Initializing workspace engine..." />
      )}
    </div>
  );
};
