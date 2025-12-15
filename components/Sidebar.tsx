import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const links = [
    { path: '/', label: 'Dashboard', icon: 'fa-chart-line' },
    { path: '/financials', label: 'BLU Financials', icon: 'fa-file-invoice-dollar' },
    { path: '/clinical', label: 'Clinical Intelligence', icon: 'fa-user-md' },
    { path: '/settings', label: 'Settings', icon: 'fa-cog' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold tracking-wider text-blue-400">REGU-AI</h1>
        <p className="text-xs text-slate-400 mt-1">BLU Compliance & Clinical</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg transform translate-x-1'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <i className={`fas ${link.icon} w-6 text-center`}></i>
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            DR
          </div>
          <div>
            <p className="text-sm font-semibold">Dr. Admin</p>
            <p className="text-xs text-slate-400">Chief Medical Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;