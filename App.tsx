
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import AIInsights from './components/AIInsights';
import Login from './components/Login';
import CompanyManagement from './components/CompanyManagement';
import WorkerManagement from './components/WorkerManagement';
import { PatientRecord, User, UserRole, Company, Worker, ClinicSettings } from './types';
import { INITIAL_RECORDS, MOCK_COMPANIES, MOCK_WORKERS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [records, setRecords] = useState<PatientRecord[]>(INITIAL_RECORDS);
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [workers, setWorkers] = useState<Worker[]>(MOCK_WORKERS);
  const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);

  // Clinic Settings State
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>({
    clinicName: 'Klinik Dan Surgeri Abriel',
    doctorName: 'DR Louis Nethaniel Johnson'
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSettings, setTempSettings] = useState<ClinicSettings>(clinicSettings);

  const handleAddRecord = (record: PatientRecord) => {
    // Check if it's an update (same ID exists) or a new one
    const exists = records.some(r => r.id === record.id);
    if (exists) {
        setRecords(prev => prev.map(r => r.id === record.id ? record : r));
    } else {
        setRecords(prev => [record, ...prev]);
    }
    setEditingRecord(null); // Clear editing state
    setActiveTab('patients');
  };

  const handleUpdateRecord = (updatedRecord: PatientRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  const handleEditRecord = (record: PatientRecord) => {
    setEditingRecord(record);
    setActiveTab('report');
  };

  const handleAddCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
  };

  const handleAddWorker = (worker: Worker) => {
    setWorkers(prev => [...prev, worker]);
    setCompanies(prev => prev.map(c => 
      c.id === worker.companyId ? { ...c, workerCount: c.workerCount + 1 } : c
    ));
    setActiveTab('workers');
  };

  const saveSettings = () => {
    setClinicSettings(tempSettings);
    setShowSettingsModal(false);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView records={records} />;
      case 'patients':
        return (
          <div className="space-y-6">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Worker Surveillance Registry</h2>
                <p className="text-slate-400 text-sm">Verified occupational health records and fit-to-work status</p>
              </div>
              <button onClick={() => { setEditingRecord(null); setActiveTab('report'); }} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-colors">New Examination</button>
            </header>
            <PatientList records={records} onUpdateRecord={handleUpdateRecord} onEditRecord={handleEditRecord} />
          </div>
        );
      case 'report':
        return <PatientForm onAddRecord={handleAddRecord} workers={workers} companies={companies} initialData={editingRecord} />;
      case 'ai':
        return <AIInsights records={records} />;
      case 'companies':
        return <CompanyManagement companies={companies} onAddCompany={handleAddCompany} />;
      case 'workers':
        return <WorkerManagement workers={workers} companies={companies} onAddWorker={handleAddWorker} />;
      default:
        return <DashboardView records={records} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-['Inter'] text-slate-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Modern SaaS Header */}
        <div className="flex justify-between items-center mb-10 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-6 group">
            <div className="hidden md:block">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Clinic Branch</h3>
              <p className="text-xs text-slate-200 font-bold">{clinicSettings.clinicName}</p>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div className="hidden lg:block">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Licensed OHD</h3>
              <p className="text-xs text-slate-200 font-bold">{clinicSettings.doctorName}</p>
            </div>
            <button 
              onClick={() => {
                setTempSettings(clinicSettings);
                setShowSettingsModal(true);
              }}
              className="ml-2 text-[10px] font-black uppercase text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-1 rounded border border-blue-500/20 transition-all opacity-0 group-hover:opacity-100"
            >
              Edit Details
            </button>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white leading-none">{user.name}</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">{user.role}</p>
              </div>
              <div className="relative">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff&bold=true`} alt="Profile" className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-800 shadow-sm" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <button onClick={() => setUser(null)} className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-all">🚪</button>
          </div>
        </div>

        <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
          {renderContent()}
        </div>
      </main>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800 animate-in fade-in zoom-in duration-200">
              <div className="bg-slate-950 p-6 text-white border-b border-slate-800">
                <h3 className="text-xl font-black uppercase tracking-tight">Clinic Details</h3>
                <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Update Header Information</p>
              </div>
              <div className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Clinic Branch Name</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={tempSettings.clinicName}
                    onChange={(e) => setTempSettings({...tempSettings, clinicName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Licensed OHD Name</label>
                  <input 
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={tempSettings.doctorName}
                    onChange={(e) => setTempSettings({...tempSettings, doctorName: e.target.value})}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setShowSettingsModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
                  <button onClick={saveSettings} className="flex-1 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">Save Changes</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
