export type WidgetType =
  | 'MetricCard'
  | 'LineChartWidget'
  | 'BarChartWidget'
  | 'PieChartWidget'
  | 'ClientOverviewWidget'
  | 'CommunicationWidget'
  | 'MeetingNotesWidget'
  | 'OpenIssuesWidget'
  | 'TalkingPointsWidget'
  | 'ProjectProgressWidget'
  | 'TaskListWidget'
  | 'DeadlineWidget'
  | 'ComplaintSummaryWidget'
  | 'RecommendedActionsWidget'
  | 'ExplanationPanel'
  | 'EmptyState'
  | 'LoadingState'
  | 'ErrorState';

export interface WidgetConfig {
  id: string;
  type: WidgetType | string;
  title: string;
  priority: number;
  size: 'small' | 'medium' | 'large' | 'full';
  category?: string;
  description?: string;
  hidden?: boolean;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  action_type: 'checkbox' | 'button' | 'modal';
}

export interface WorkspaceConfig {
  task_title: string;
  intent: string;
  confidence: number;
  summary: string;
  widgets: WidgetConfig[];
  explanation: string;
}

export interface WorkspaceResponse {
  task_id?: number | null;
  task_title: string;
  intent: string;
  confidence: number;
  summary: string;
  widgets: WidgetConfig[];
  widget_data: Record<string, any>;
  recommended_actions: RecommendedAction[];
  explanation: string;
  explanations_per_widget: Record<string, string>;
  is_fallback: boolean;
  data_source: string;
  available_info: string[];
  missing_info: string[];
  recommended_next_step: string;
  workspace_configuration: WorkspaceConfig;
}

export interface TaskItem {
  id: number;
  user_id: string;
  title: string;
  original_prompt: string;
  detected_intent: string;
  status: 'active' | 'completed' | 'archived';
  is_saved: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  theme: 'light' | 'dark';
  preferred_widgets: string[];
  layout_preferences: Record<string, any>;
}

export interface ProjectTask {
  id: number;
  project_name: string;
  title: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  created_at?: string;
}

export interface DefaultDashboardData {
  welcome: {
    user_name: string;
    role: string;
    greeting: string;
    subheading: string;
  };
  quick_stats: Array<{
    id: string;
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: string;
  }>;
  quick_actions: Array<{
    id: string;
    title: string;
    prompt: string;
    badge: string;
    icon: string;
  }>;
  recent_activity: Array<{
    id: string;
    time: string;
    user: string;
    action: string;
    project: string;
  }>;
  sample_analytics_preview: Array<{
    name: string;
    activeUsers: number;
    sessions: number;
    retention: number;
  }>;
  suggested_prompts: string[];
}
