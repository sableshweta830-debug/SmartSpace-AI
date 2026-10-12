import {
  WorkspaceResponse,
  TaskItem,
  UserPreferences,
  ProjectTask,
  DefaultDashboardData
} from '../types';

// ── AI Chat Types (keep here so no secrets ever touch frontend) ───────────
export interface ChatMessage {
  response: string;
  provider: string;
}

export interface AiStatusResponse {
  configured: boolean;
  provider: string;
  status: string;
}

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // When running on GitHub Pages or HTTPS public domain, connect to Render backend
  if (typeof window !== 'undefined') {
    const hostname = window.location?.hostname || '';
    if (hostname.includes('github.io') || window.location.protocol === 'https:') {
      return 'https://smartspace-ai.onrender.com';
    }
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:8000`;
    }
  }
  return 'http://127.0.0.1:8000';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody.detail || `Server error: ${response.status} ${response.statusText}`;
        throw new Error(message);
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(
          `Unable to connect to the backend server at ${this.baseUrl}. Please verify the FastAPI backend is running on port 8000.`
        );
      }
      throw error;
    }
  }

  // Health
  async checkHealth(): Promise<{ status: string; healthy: boolean; app: string }> {
    return this.request('/health');
  }

  // Intent
  async analyzeIntent(text: string) {
    return this.request<{
      intent: string;
      confidence: number;
      entities: Record<string, any>;
      clarification_needed: boolean;
      clarification_question?: string;
      suggested_alternatives?: string[];
      is_fallback: boolean;
      provider: string;
    }>('/api/intent/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Workspace
  async generateWorkspace(text: string, saveToHistory: boolean = true): Promise<WorkspaceResponse> {
    return this.request<WorkspaceResponse>('/api/workspace/generate', {
      method: 'POST',
      body: JSON.stringify({ text, save_to_history: saveToHistory }),
    });
  }

  async getDefaultDashboard(): Promise<DefaultDashboardData> {
    return this.request<DefaultDashboardData>('/api/workspace/default');
  }

  // Tasks
  async getTasks(savedOnly: boolean = false): Promise<TaskItem[]> {
    return this.request<TaskItem[]>(`/api/tasks?saved_only=${savedOnly}`);
  }

  async getTaskDetails(taskId: number): Promise<{ task: TaskItem; configuration: any; widget_data: any }> {
    return this.request(`/api/tasks/${taskId}`);
  }

  async updateTask(taskId: number, updates: { title?: string; status?: string; is_saved?: boolean }): Promise<TaskItem> {
    return this.request<TaskItem>(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: number): Promise<{ message: string; deleted_id: number }> {
    return this.request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // History
  async getHistory(): Promise<TaskItem[]> {
    return this.request<TaskItem[]>('/api/history');
  }

  // Preferences
  async getPreferences(): Promise<UserPreferences> {
    return this.request<UserPreferences>('/api/preferences');
  }

  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.request<UserPreferences>('/api/preferences', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Demo Data
  async getDemoAnalytics(): Promise<any> {
    return this.request('/api/demo/analytics');
  }

  async getDemoProjects(): Promise<{ project_overview: any; task_list: ProjectTask[]; [key: string]: any }> {
    return this.request('/api/demo/projects');
  }

  async updateProjectTask(taskId: number, updates: { status?: string; priority?: string }): Promise<ProjectTask> {
    return this.request<ProjectTask>(`/api/demo/projects/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // ── AI Chat ───────────────────────────────────────────────────────────────
  // API key lives ONLY on the backend. This method only sends the message text.
  async sendChatMessage(message: string): Promise<ChatMessage> {
    return this.request<ChatMessage>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getAiStatus(): Promise<AiStatusResponse> {
    return this.request<AiStatusResponse>('/api/ai/status');
  }
}

export const api = new ApiService();
