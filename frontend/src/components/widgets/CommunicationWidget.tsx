import React from 'react';
import { Mail, MessageSquare, Clock, AlertCircle } from 'lucide-react';

interface CommunicationWidgetProps {
  data?: any;
}

export const CommunicationWidget: React.FC<CommunicationWidgetProps> = ({ data }) => {
  const comms = data?.recent_communications || [];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="space-y-3">
        {comms.map((item: any) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-300 dark:hover:border-brand-800 transition-all text-xs flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                  {item.channel === 'Email' ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {item.subject}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 text-slate-400 text-[11px]">
                <Clock className="w-3 h-3" />
                <span>{item.timestamp}</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
              {item.summary}
            </p>

            <div className="flex items-center justify-between pt-1 pl-6 text-[11px]">
              <span className="text-slate-400 font-medium">From: {item.sender}</span>
              {item.pending_response && (
                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/50">
                  <AlertCircle className="w-3 h-3" />
                  Response Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
