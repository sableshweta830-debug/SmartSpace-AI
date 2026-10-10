import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Mic,
  MicOff,
  X,
  Search,
  Loader2,
  Calendar,
  TrendingDown,
  ListTodo,
  MessageSquareWarning,
  Presentation,
} from 'lucide-react';

interface CommandBarProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

const DEFAULT_SUGGESTIONS = [
  { label: "Client Meeting", prompt: "Prepare for tomorrow's client meeting.", icon: Calendar },
  { label: "Usage Drop", prompt: "Investigate why product usage dropped this month.", icon: TrendingDown },
  { label: "Project Progress", prompt: "Review the progress of our ongoing project.", icon: ListTodo },
  { label: "Customer Complaints", prompt: "Summarize recent customer complaints.", icon: MessageSquareWarning },
  { label: "Presentation", prompt: "Help me prepare a project presentation.", icon: Presentation },
];

export const CommandBar: React.FC<CommandBarProps> = ({
  onSubmit,
  isLoading = false,
  initialValue = '',
}) => {
  const [prompt, setPrompt] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setPrompt(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    // Check speech recognition support
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const handleVoiceInput = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in this browser. Please type your task in the input box.");
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        setIsListening(false);
      };

      recognition.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onSubmit(prompt.trim());
  };

  const handleSelectSuggestion = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
    onSubmit(suggestedPrompt);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Search Input Box */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 focus-within:border-brand-500 dark:focus-within:border-brand-500 shadow-md shadow-slate-200/40 dark:shadow-none transition-all overflow-hidden"
      >
        <div className="pl-4 pr-2 text-brand-600 dark:text-brand-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What do you want to accomplish today?"
          className="w-full py-4 px-2 text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent focus:outline-none"
          disabled={isLoading}
        />

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pr-3">
          {prompt && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isListening ? 'Listening...' : 'Voice command (Speech recognition)'}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all ${
              !prompt.trim() || isLoading
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-brand-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Adapting...</span>
              </>
            ) : (
              <>
                <span>Generate</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-400 font-medium text-[11px] shrink-0">Try goals:</span>
        {DEFAULT_SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSuggestion(item.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400 shadow-2xs transition-all hover:-translate-y-0.5"
            >
              <Icon className="w-3.5 h-3.5 text-brand-500" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
