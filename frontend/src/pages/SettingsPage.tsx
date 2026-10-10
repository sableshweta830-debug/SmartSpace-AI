import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Cpu,
  Database,
  ShieldCheck,
  Check,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';

interface SettingsPageProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  darkMode,
  onToggleTheme,
}) => {
  const [healthInfo, setHealthInfo] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.checkHealth().then(setHealthInfo).catch(console.error);
  }, []);

  const handleSavePreferences = async () => {
    try {
      await api.updatePreferences({ theme: darkMode ? 'dark' : 'light' });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error('Failed to save preferences:', e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Workspace Settings & System Status
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure appearance, review engine architecture, and check local backend connectivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              Interface Appearance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Switch between daylight clean SaaS palette and low-light obsidian dark theme.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { if (darkMode) onToggleTheme(); }}
                className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                  !darkMode
                    ? 'border-brand-500 bg-brand-50/50 text-brand-700 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold">Light Theme</span>
              </button>

              <button
                onClick={() => { if (!darkMode) onToggleTheme(); }}
                className={`p-4 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                  darkMode
                    ? 'border-brand-500 bg-slate-800 text-brand-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <Moon className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold">Dark Theme</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'Saved in SQLite Database' : 'Save Theme Preference'}</span>
          </button>
        </div>

        {/* AI & Engine Status Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Intent Engine & Fallback Architecture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Designed to run 100% locally and offline without requiring paid API tokens.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500">Active Engine:</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400">
                  Deterministic Rule-Based & Semantic Scorer
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500">Backend Server:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {healthInfo?.status === 'ok' ? 'Online (FastAPI / 8000)' : 'Checking...'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500">Database Engine:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  SQLite (workspace.db via SQLAlchemy)
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
            🔒 <strong>Privacy & Security Note:</strong> API keys are read strictly from backend environment variables and never exposed to client-side browsers.
          </div>
        </div>
      </div>
    </div>
  );
};
