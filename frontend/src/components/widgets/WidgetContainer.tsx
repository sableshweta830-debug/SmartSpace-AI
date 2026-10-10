import React, { useState } from 'react';
import { EyeOff, Info, HelpCircle } from 'lucide-react';

interface WidgetContainerProps {
  id: string;
  title: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  category?: string;
  explanation?: string;
  onHide?: (id: string) => void;
  children: React.ReactNode;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  size = 'medium',
  category,
  explanation,
  onHide,
  children,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  // Size grid mapping
  const sizeClasses = {
    small: 'col-span-12 md:col-span-6 lg:col-span-4',
    medium: 'col-span-12 md:col-span-6 lg:col-span-6',
    large: 'col-span-12 lg:col-span-8',
    full: 'col-span-12',
  }[size] || 'col-span-12 md:col-span-6';

  return (
    <div
      className={`${sizeClasses} bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative group`}
      id={`widget-${id}`}
    >
      {/* Widget Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5 min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {title}
          </h3>
          {category && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          {explanation && (
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              title="Why is this component here?"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                showExplanation
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4" />
            </button>
          )}

          {onHide && (
            <button
              onClick={() => onHide(id)}
              title="Hide this widget"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Explanation Drawer */}
      {showExplanation && explanation && (
        <div className="px-5 py-2.5 bg-brand-50/70 dark:bg-brand-950/30 border-b border-brand-100 dark:border-brand-900/40 text-xs text-brand-900 dark:text-brand-200 flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-brand-600 dark:text-brand-400" />
          <p className="leading-relaxed">
            <span className="font-semibold">Why this widget:</span> {explanation}
          </p>
        </div>
      )}

      {/* Widget Body */}
      <div className="p-5 flex-1 flex flex-col">{children}</div>
    </div>
  );
};
