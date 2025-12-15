import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FinancialReports from './components/FinancialReports';
import ClinicalAssistant from './components/ClinicalAssistant';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Helper to determine page title
  const getPageTitle = (path: string) => {
    switch(path) {
      case '/': return 'Executive Dashboard';
      case '/financials': return 'Financial Reports';
      case '/clinical': return 'Clinical Intelligence';
      case '/settings': return 'System Settings';
      default: return 'REGU-AI';
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="flex items-center space-x-4">
             <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                System Operational
             </div>
             <button className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
               <i className="fas fa-bell"></i>
             </button>
          </div>
        </header>
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  );
};

const SettingsPlaceholder = () => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
      <i className="fas fa-cogs text-2xl"></i>
    </div>
    <h3 className="text-xl font-bold text-slate-800">Settings Configuration</h3>
    <p className="text-slate-500 mt-2 max-w-md mx-auto">
      Configure role-based access control (RBAC), API endpoints for Cloud Healthcare API, and audit log retention policies here.
    </p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/financials" element={<FinancialReports />} />
          <Route path="/clinical" element={<ClinicalAssistant />} />
          <Route path="/settings" element={<SettingsPlaceholder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;