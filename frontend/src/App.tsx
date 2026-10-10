import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AdaptiveWorkspacePage } from './pages/AdaptiveWorkspacePage';
import { TaskHistoryPage } from './pages/TaskHistoryPage';
import { SavedWorkspacesPage } from './pages/SavedWorkspacesPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { WorkspaceResponse } from './types';
import { api } from './services/api';

export function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceResponse | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleWorkspaceChange = (workspace: WorkspaceResponse | null) => {
    setActiveWorkspace(workspace);
  };

  return (
    <BrowserRouter>
      <Layout
        currentWorkspaceTitle={activeWorkspace?.task_title || 'Default Dashboard'}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        activeTaskCount={activeWorkspace ? 1 : 0}
      >
        <Routes>
          <Route
            path="/"
            element={<HomePage onWorkspaceChange={handleWorkspaceChange} />}
          />
          <Route
            path="/workspace"
            element={
              activeWorkspace ? (
                <AdaptiveWorkspacePage
                  workspace={activeWorkspace}
                  onResetLayout={() => setActiveWorkspace(null)}
                />
              ) : (
                <HomePage onWorkspaceChange={handleWorkspaceChange} />
              )
            }
          />
          <Route
            path="/history"
            element={<TaskHistoryPage onLoadWorkspace={handleWorkspaceChange} />}
          />
          <Route
            path="/saved"
            element={<SavedWorkspacesPage onLoadWorkspace={handleWorkspaceChange} />}
          />
          <Route
            path="/settings"
            element={<SettingsPage darkMode={darkMode} onToggleTheme={toggleTheme} />}
          />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
