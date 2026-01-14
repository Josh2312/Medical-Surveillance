
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole }) => {
  const getNavItems = () => {
    const items = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: [UserRole.ADMIN, UserRole.CLINICIAN, UserRole.COMPANY_HR] },
      { id: 'companies', label: 'Companies', icon: '🏢', roles: [UserRole.ADMIN, UserRole.CLINICIAN, UserRole.COMPANY_HR] },
      { id: 'workers', label: 'Workers', icon: '👥', roles: [UserRole.ADMIN, UserRole.CLINICIAN, UserRole.COMPANY_HR] },
      { id: 'report', label: 'Medical Records', icon: '📝', roles: [UserRole.ADMIN, UserRole.CLINICIAN] },
      { id: 'patients', label: 'Registry', icon: '📋', roles: [UserRole.ADMIN, UserRole.CLINICIAN, UserRole.COMPANY_HR] },
      { id: 'ai', label: 'Health Trends', icon: '🧠', roles: [UserRole.ADMIN, UserRole.CLINICIAN] },
    ];
    return items.filter(item => item.roles.includes(userRole));
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col text-slate-300">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
          MV
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight">MediVision</h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Surveillance Pro</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 mt-4">
        {getNavItems().map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10 font-semibold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-xs font-medium text-slate-300">SaaS Node Alpha Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
