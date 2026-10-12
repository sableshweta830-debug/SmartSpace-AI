import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  AlertCircle,
  Loader2,
  User,
  Copy,
  Check,
  Info,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';

// ── Types ──────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'error';
  content: string;
  timestamp: Date;
  provider?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Very light markdown → JSX renderer for bold / code / line-breaks. */
function renderContent(text: string): React.ReactNode {
  const lines = text.split('\n');
  return lines.map((line, li) => {
    // Bold: **text** or __text__
    const parts = line.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
    return (
      <React.Fragment key={li}>
        {parts.map((part, pi) => {
          if (/^\*\*.*\*\*$/.test(part) || /^__.*__$/.test(part)) {
            const inner = part.slice(2, -2);
            return <strong key={pi} className="font-semibold">{inner}</strong>;
          }
          // Inline code: `code`
          if (/^`[^`]+`$/.test(part)) {
            const inner = part.slice(1, -1);
            return (
              <code key={pi} className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-mono text-brand-700 dark:text-brand-300">
                {inner}
              </code>
            );
          }
          return <span key={pi}>{part}</span>;
        })}
        {li < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────

interface MessageBubbleProps {
  msg: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [msg.content]);

  if (msg.role === 'user') {
    return (
      <div className="flex items-start gap-2.5 justify-end group">
        <div className="max-w-[78%]">
          <div className="px-4 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-br from-brand-600 to-indigo-600 text-white text-sm leading-relaxed shadow-md shadow-brand-500/20">
            {msg.content}
          </div>
          <div className="text-right text-[10px] text-slate-400 mt-1 mr-1">{formatTime(msg.timestamp)}</div>
        </div>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  if (msg.role === 'error') {
    return (
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
        <div className="max-w-[78%]">
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm leading-relaxed">
            <span className="font-semibold block mb-0.5">Error</span>
            {msg.content}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 ml-1">{formatTime(msg.timestamp)}</div>
        </div>
      </div>
    );
  }

  // assistant
  return (
    <div className="flex items-start gap-2.5 group">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm shadow-brand-400/30">
        <Bot className="w-4 h-4" />
      </div>
      <div className="max-w-[78%]">
        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 text-sm leading-relaxed shadow-sm">
          {renderContent(msg.content)}
        </div>
        <div className="flex items-center gap-2 mt-1 ml-1">
          <span className="text-[10px] text-slate-400">{formatTime(msg.timestamp)}</span>
          {msg.provider && (
            <span className="text-[10px] text-slate-400 hidden group-hover:inline">
              · via {msg.provider}
            </span>
          )}
          <button
            onClick={handleCopy}
            title="Copy response"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Typing indicator ──────────────────────────────────────────────────────

const TypingIndicator: React.FC = () => (
  <div className="flex items-start gap-2.5">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
      <Bot className="w-4 h-4" />
    </div>
    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

// ── Suggested prompts ──────────────────────────────────────────────────────

const SUGGESTIONS = [
  'What features does SmartSpace AI have?',
  'How does the intent detection work?',
  'Show me a summary of my recent tasks',
  'How does the adaptive layout engine decide which widgets to show?',
  'What are the 4 built-in demo scenarios?',
];

// ── Main AIChatPage ────────────────────────────────────────────────────────

export const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; provider: string } | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Check AI status on mount ──
  useEffect(() => {
    api.getAiStatus()
      .then(setAiStatus)
      .catch(() => setAiStatus({ configured: false, provider: 'Unknown' }))
      .finally(() => setStatusLoading(false));
  }, []);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Auto-resize textarea ──
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  }, [inputValue]);

  const sendMessage = useCallback(async (text?: string) => {
    const msgText = (text ?? inputValue).trim();
    if (!msgText || loading) return;

    const userMsg: Message = {
      id: genId(),
      role: 'user',
      content: msgText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const data = await api.sendChatMessage(msgText);
      const aiMsg: Message = {
        id: genId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        provider: data.provider,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: genId(),
        role: 'error',
        content: err?.message || 'Something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [inputValue, loading]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const clearChat = () => {
    setMessages([]);
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[900px] min-h-[520px] animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4 shrink-0">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-400/30">
              <Bot className="w-4 h-4" />
            </div>
            SmartSpace AI Assistant
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 ml-10">
            Ask anything about your workspace, tasks, or how the platform works.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Status badge */}
          {!statusLoading && (
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border shadow-xs ${
              aiStatus?.configured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
            }`}>
              <span className={`w-2 h-2 rounded-full ${aiStatus?.configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              {aiStatus?.configured ? aiStatus.provider : 'AI not configured'}
            </div>
          )}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              title="Clear chat"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 border border-slate-200/80 dark:border-slate-800 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Not configured banner ── */}
      {!statusLoading && !aiStatus?.configured && (
        <div className="mb-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs shrink-0">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-amber-800 dark:text-amber-300">
            <span className="font-semibold">AI assistant not configured.</span>{' '}
            Add{' '}
            <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 font-mono">GEMINI_API_KEY=your_key</code>{' '}
            to your <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 font-mono">backend.env</code>{' '}
            file and restart the backend. Get a free key at{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
              aistudio.google.com
            </a>.
          </div>
        </div>
      )}

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500/20 to-indigo-600/20 border border-brand-200 dark:border-brand-900/50 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                How can I help you today?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Ask about your workspace, task history, platform features, or anything else. I have live context from your database.
              </p>
            </div>
            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  disabled={loading || !aiStatus?.configured}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-700 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {loading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="mt-4 shrink-0">
        <div className="flex items-end gap-2.5 p-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-sm focus-within:ring-2 focus-within:ring-brand-400/40 focus-within:border-brand-400 dark:focus-within:border-brand-600 transition-all">
          <textarea
            ref={inputRef}
            id="ai-chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              aiStatus?.configured
                ? 'Ask anything about SmartSpace AI... (Enter to send, Shift+Enter for newline)'
                : 'AI assistant is not configured — see banner above'
            }
            disabled={loading || !aiStatus?.configured}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none min-h-[36px] max-h-40 py-1.5 px-1 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
          />
          <button
            id="ai-chat-send-btn"
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || loading || !aiStatus?.configured}
            title="Send message"
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/25 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center mt-2">
          SmartSpace AI may make mistakes. API keys are never exposed to this interface.
        </p>
      </div>
    </div>
  );
};
