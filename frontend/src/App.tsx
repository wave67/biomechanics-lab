import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import ProjectsList from './pages/Projects';
import ProjectDetail from './pages/Projects/ProjectDetail';
import Samples from './pages/Samples';
import Participants from './pages/Participants';
import Equipment from './pages/Equipment';
import Protocols from './pages/Protocols';
import Metrics from './pages/Metrics';
import Analysis from './pages/Analysis';
import Reports from './pages/Reports';
import Files from './pages/Files';
import BackupCenter from './components/BackupCenter';

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="samples" element={<Samples />} />
            <Route path="participants" element={<Participants />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="protocols" element={<Protocols />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="analysis" element={<Analysis />} />
            <Route path="reports" element={<Reports />} />
            <Route path="files" element={<Files />} />
            <Route path="backup" element={<BackupCenter />} />
          </Route>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
};

export default App;
