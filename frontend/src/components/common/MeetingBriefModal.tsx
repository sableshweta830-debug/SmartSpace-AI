import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download } from 'lucide-react';

interface MeetingBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientData: any;
}

export const MeetingBriefModal: React.FC<MeetingBriefModalProps> = ({
  isOpen,
  onClose,
  clientData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const client = clientData?.client_overview || {};
  const comms = clientData?.recent_communications || [];
  const meetingSummary = clientData?.previous_meeting_summary || {};
  const issues = clientData?.open_issues || [];

  const briefText = `=====================================================
EXECUTIVE MEETING BRIEF (DEMO SYNTHESIS)
Client: ${client.client_name || 'Acme Global Solutions'}
Industry: ${client.industry || 'Enterprise FinTech'}
Account Status: ${client.relationship_status || 'Strategic Partner'}
ACV: ${client.annual_contract_value || '$420,000 / yr'}
=====================================================

1. OBJECTIVES & CONTEXT
- Review ongoing Q4 cloud migration milestone.
- Re-align on latency SLA remediations following recent Redis caching deployment.
- Discuss upcoming contract renewal scheduled for ${client.renewal_date || 'Dec 2026'}.

2. RECENT COMMUNICATIONS SUMMARY
${comms.map((c: any) => `- [${c.channel}] ${c.subject} (${c.sender}): ${c.summary}`).join('\n')}

3. OUTSTANDING COMMITMENTS & DECISIONS FROM PREVIOUS MEETING (${meetingSummary.meeting_date || 'Sept 28, 2026'})
Key Decisions:
${(meetingSummary.key_decisions || []).map((d: string) => `  * ${d}`).join('\n')}
Commitments:
${(meetingSummary.commitments || []).map((c: string) => `  * ${c}`).join('\n')}

4. HIGH-PRIORITY OPEN ISSUES
${issues.map((i: any) => `- [${i.priority}] ${i.title} -> Suggested Next Action: ${i.suggested_action}`).join('\n')}

[Note: Generated from demo workspace dataset. No access to live external mailboxes was simulated.]
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([briefText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "Client_Meeting_Brief_AcmeGlobal.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Generated Meeting Brief
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synthesized from verified demo client telemetry & records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-950/40 whitespace-pre-wrap leading-relaxed select-text">
          {briefText}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Source: Demo Data Repository
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Brief
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
