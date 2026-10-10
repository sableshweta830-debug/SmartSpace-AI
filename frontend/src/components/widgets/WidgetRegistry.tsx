import React from 'react';
import { WidgetConfig } from '../../types';
import { WidgetContainer } from './WidgetContainer';
import { MetricCard } from './MetricCard';
import { LineChartWidget } from './LineChartWidget';
import { BarChartWidget } from './BarChartWidget';
import { PieChartWidget } from './PieChartWidget';
import { ClientOverviewWidget } from './ClientOverviewWidget';
import { CommunicationWidget } from './CommunicationWidget';
import { MeetingNotesWidget } from './MeetingNotesWidget';
import { OpenIssuesWidget } from './OpenIssuesWidget';
import { TalkingPointsWidget } from './TalkingPointsWidget';
import { ProjectProgressWidget } from './ProjectProgressWidget';
import { TaskListWidget } from './TaskListWidget';
import { DeadlineWidget } from './DeadlineWidget';
import { ComplaintSummaryWidget } from './ComplaintSummaryWidget';
import { RecommendedActionsWidget } from './RecommendedActionsWidget';
import { ExplanationPanel } from './ExplanationPanel';
import { EmptyState } from '../common/EmptyState';
import { AlertCircle } from 'lucide-react';

// Widget component mapping registry
const WIDGET_REGISTRY: Record<string, React.ComponentType<any>> = {
  MetricCard,
  LineChartWidget,
  BarChartWidget,
  PieChartWidget,
  ClientOverviewWidget,
  CommunicationWidget,
  MeetingNotesWidget,
  OpenIssuesWidget,
  TalkingPointsWidget,
  ProjectProgressWidget,
  TaskListWidget,
  DeadlineWidget,
  ComplaintSummaryWidget,
  RecommendedActionsWidget,
  ExplanationPanel,
};

interface RenderWidgetProps {
  config: WidgetConfig;
  data: any;
  explanation?: string;
  onHide?: (id: string) => void;
  onGenerateBrief?: () => void;
  onTaskUpdated?: (task: any) => void;
}

export const RenderWidget: React.FC<RenderWidgetProps> = ({
  config,
  data,
  explanation,
  onHide,
  onGenerateBrief,
  onTaskUpdated,
}) => {
  if (config.hidden) {
    return null;
  }

  const Component = WIDGET_REGISTRY[config.type];

  // Graceful fallback for unknown widget type
  if (!Component) {
    return (
      <WidgetContainer
        id={config.id}
        title={config.title || 'Dynamic Widget'}
        size={config.size}
        category={config.category}
        explanation={explanation}
        onHide={onHide}
      >
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs flex items-center gap-3 text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <div className="font-semibold">Unknown widget type: &quot;{config.type}&quot;</div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
              The layout engine assigned this component, but no registered React view was found.
            </div>
          </div>
        </div>
      </WidgetContainer>
    );
  }

  return (
    <WidgetContainer
      id={config.id}
      title={config.title}
      size={config.size}
      category={config.category}
      explanation={explanation}
      onHide={onHide}
    >
      <Component
        data={data}
        onGenerateBrief={onGenerateBrief}
        onTaskUpdated={onTaskUpdated}
      />
    </WidgetContainer>
  );
};
