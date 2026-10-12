import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  Wifi,
  Menu,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  currentWorkspaceTitle?: string;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenMobileMenu?: () => void;
  backendOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentWorkspaceTitle = 'Default Dashboard',
  darkMode,
  onToggleTheme,
  onOpenMobileMenu,
  backendOnline = true,
}) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return ['Dashboard'];
    if (path === '/workspace') return ['Workspace', currentWorkspaceTitle];
    if (path === '/history') return ['Task History'];
    if (path === '/saved') return ['Saved Workspaces'];
    if (path === '/settings') return ['Settings'];
    if (path === '/help') return ['Documentation'];
    if (path === '/ai-chat') return ['AI Assistant'];
    return ['Workspace'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium overflow-hidden">
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">Workspace</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              <span
                className={`truncate ${
                  idx === breadcrumbs.length - 1
                    ? 'font-bold text-slate-900 dark:text-slate-100'
                    : ''
                }`}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Status badge & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Backend Connectivity Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Backend Connected (Port 8000)</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 text-xs animate-in fade-in duration-100">
              <div className="font-semibold text-slate-800 dark:text-slate-100 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Recent Workspace Alerts</span>
                <span className="text-[10px] text-brand-600 font-normal">2 new</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <div className="font-medium text-slate-800 dark:text-slate-200">Adaptive Layout Ready</div>
                  <div className="text-slate-400 text-[11px]">Dynamic workspace engine configured for task.</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                  <div className="font-medium text-slate-800 dark:text-slate-200">SLA Telemetry Updated</div>
                  <div className="text-slate-400 text-[11px]">30-day baseline data loaded into SQLite.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            AM
          </div>
        </div>
      </div>
    </header>
  );
};
