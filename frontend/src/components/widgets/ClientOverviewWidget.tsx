import React from 'react';
import { Building2, Award, Calendar, DollarSign, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ClientOverviewWidgetProps {
  data?: any;
}

export const ClientOverviewWidget: React.FC<ClientOverviewWidgetProps> = ({ data }) => {
  const client = data?.client_overview || data?.presentation_overview || {};

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-600/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {client.client_name || client.title || 'Client Profile'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {client.industry || client.audience || 'Enterprise Partner'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {client.relationship_status && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Award className="w-3.5 h-3.5" />
              {client.relationship_status}
            </span>
          )}
        </div>
      </div>

      {/* Key Financial & Timeline Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        {client.annual_contract_value && (
          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Annual Value</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {client.annual_contract_value}
            </span>
          </div>
        )}
        {client.renewal_date && (
          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Contract Renewal</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {client.renewal_date}
            </span>
          </div>
        )}
        {client.account_manager && (
          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 col-span-2 sm:col-span-1">
            <span className="text-slate-400 dark:text-slate-500 block mb-0.5">Account Lead</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {client.account_manager}
            </span>
          </div>
        )}
      </div>

      {/* Current Projects */}
      {client.current_projects && (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Active Projects With Client
          </h5>
          <div className="space-y-2">
            {client.current_projects.map((proj: any, idx: number) => {
              const isOnTrack = proj.health === 'On Track';
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-xs"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                    {isOnTrack ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <span>{proj.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">{proj.completion}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isOnTrack
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {proj.health}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Contacts */}
      {client.key_contacts && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 text-xs">
          <span className="text-slate-400 font-medium">Key Attendees:</span>
          {client.key_contacts.map((contact: any, i: number) => (
            <div key={i} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="font-semibold">{contact.name}</span>
              <span className="text-slate-400">({contact.role})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
