
import React, { useState } from 'react';
import { Worker, Company, Ethnicity, MaritalStatus } from '../types';

interface WorkerManagementProps {
  workers: Worker[];
  companies: Company[];
  onAddWorker: (worker: Worker) => void;
}

const WorkerManagement: React.FC<WorkerManagementProps> = ({ workers, companies, onAddWorker }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    companyId: '',
    name: '',
    age: 18,
    address: '',
    icPassport: '',
    gender: 'Male',
    maritalStatus: MaritalStatus.SINGLE,
    noOfChildren: 0,
    ethnicity: Ethnicity.MALAY,
    ethnicityOthers: '',
    isMalaysian: true,
    jobRole: ''
  });

  const sortedWorkers = [...workers].sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const company = companies.find(c => c.id === formData.companyId);
    const newWorker: Worker = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      companyName: company?.name || 'Unassigned',
      hazards: []
    };
    onAddWorker(newWorker);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Workers Registry</h2>
          <p className="text-slate-500 text-sm font-bold">Detailed personal and employment profiles</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
        >
          + Add Worker
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Name / ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employment</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Demographics</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Citizenship</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sortedWorkers.map(worker => (
                <tr key={worker.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{worker.name}</p>
                    <p className="text-xs font-bold text-slate-500">{worker.icPassport}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-300">{worker.jobRole}</p>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">{worker.companyName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-400">{worker.age}y • {worker.gender}</p>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{worker.ethnicity === Ethnicity.OTHERS ? worker.ethnicityOthers : worker.ethnicity}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-400">{worker.maritalStatus}</p>
                    <p className="text-[10px] text-slate-600 font-bold uppercase">{worker.noOfChildren} children</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${worker.isMalaysian ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                      {worker.isMalaysian ? 'Malaysian' : 'Foreigner'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 border border-slate-800">
            <div className="bg-slate-950 p-6 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">New Worker Registration</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Personal & Occupational profile</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white p-2">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Assigned Company</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20"
                    value={formData.companyId}
                    onChange={e => setFormData({...formData, companyId: e.target.value})}
                  >
                    <option value="" className="bg-slate-900">Select Company</option>
                    {companies.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input required className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Age</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Gender</label>
                    <select className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                      <option className="bg-slate-900">Male</option>
                      <option className="bg-slate-900">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">IC / Passport Number</label>
                  <input required className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.icPassport} onChange={e => setFormData({...formData, icPassport: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Current Address</label>
                  <textarea className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 h-24 resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Marital Status</label>
                    <select className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.maritalStatus} onChange={e => setFormData({...formData, maritalStatus: e.target.value as MaritalStatus})}>
                      {Object.values(MaritalStatus).map(v => <option key={v} value={v} className="bg-slate-900">{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">No. of Children</label>
                    <input type="number" className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.noOfChildren} onChange={e => setFormData({...formData, noOfChildren: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Ethnicity</label>
                  <select className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.ethnicity} onChange={e => setFormData({...formData, ethnicity: e.target.value as Ethnicity})}>
                    {Object.values(Ethnicity).map(v => <option key={v} value={v} className="bg-slate-900">{v}</option>)}
                  </select>
                </div>
                {formData.ethnicity === Ethnicity.OTHERS && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Specify Ethnicity</label>
                    <input className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.ethnicityOthers} onChange={e => setFormData({...formData, ethnicityOthers: e.target.value})} />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Job Role / Designation</label>
                  <input required className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20" value={formData.jobRole} onChange={e => setFormData({...formData, jobRole: e.target.value})} />
                </div>
                <div className="flex items-center gap-4 p-5 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <input type="checkbox" id="citizen" checked={formData.isMalaysian} onChange={e => setFormData({...formData, isMalaysian: e.target.checked})} className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500/20" />
                  <label htmlFor="citizen" className="text-sm font-bold text-slate-300 cursor-pointer uppercase tracking-widest">Malaysian Citizen</label>
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">Register Worker</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerManagement;