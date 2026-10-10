import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Circle, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { ProjectTask } from '../../types';

interface TaskListWidgetProps {
  data?: any;
  onTaskUpdated?: (updatedTask: ProjectTask) => void;
}

export const TaskListWidget: React.FC<TaskListWidgetProps> = ({ data, onTaskUpdated }) => {
  const initialTasks: ProjectTask[] = data?.task_list || [];
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Sync if prop changes
  React.useEffect(() => {
    if (data?.task_list) {
      setTasks(data.task_list);
    }
  }, [data?.task_list]);

  const handleStatusChange = async (taskId: number, newStatus: 'todo' | 'in_progress' | 'completed' | 'blocked') => {
    try {
      setUpdatingId(taskId);
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );

      // Persist to SQLite backend
      const updated = await api.updateProjectTask(taskId, { status: newStatus });
      if (onTaskUpdated) {
        onTaskUpdated(updated);
      }
    } catch (err) {
      console.error('Failed to update task status in database:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusConfig = {
    completed: {
      label: 'Completed',
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2,
    },
    in_progress: {
      label: 'In Progress',
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      icon: Clock,
    },
    todo: {
      label: 'To Do',
      color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      icon: Circle,
    },
    blocked: {
      label: 'Blocked',
      color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: AlertCircle,
    },
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Click dropdown to update live database status</span>
        <span className="font-mono text-[11px]">{tasks.length} Sprint Tasks</span>
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {tasks.map((task) => {
          const currentCfg = statusConfig[task.status] || statusConfig.todo;
          const StatusIcon = currentCfg.icon;

          return (
            <div
              key={task.id}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <StatusIcon className={`w-4 h-4 mt-0.5 shrink-0 ${
                  task.status === 'completed' ? 'text-emerald-500' :
                  task.status === 'in_progress' ? 'text-blue-500' :
                  task.status === 'blocked' ? 'text-rose-500' : 'text-slate-400'
                }`} />
                <div className="min-w-0">
                  <div className={`font-semibold text-slate-800 dark:text-slate-200 truncate ${
                    task.status === 'completed' ? 'line-through opacity-75' : ''
                  }`}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>Due: {task.due_date}</span>
                    <span>•</span>
                    <span className="capitalize">{task.priority} Priority</span>
                  </div>
                </div>
              </div>

              {/* Status Selector Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {updatingId === task.id ? (
                  <RefreshCw className="w-3.5 h-3.5 text-brand-500 animate-spin mr-1" />
                ) : null}
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as any)}
                  className={`text-[11px] font-semibold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer transition-colors ${currentCfg.color}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
