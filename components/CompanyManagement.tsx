
import React, { useState } from 'react';
import { Company } from '../types';

interface CompanyManagementProps {
  companies: Company[];
  onAddCompany: (company: Company) => void;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({ companies, onAddCompany }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ssmNumber: '',
    contactNumber: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCompany: Company = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      workerCount: 0
    };
    onAddCompany(newCompany);
    setFormData({ name: '', ssmNumber: '', contactNumber: '', address: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Companies Management</h2>
          <p className="text-slate-500 text-sm font-bold">Register and manage corporate clients</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
        >
          + Add Company
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Company Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">SSM Number</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Workers</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {companies.map(company => (
                <tr key={company.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">{company.name}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">{company.ssmNumber}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">{company.contactNumber}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {company.workerCount} Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-slate-500 max-w-xs truncate font-bold uppercase">{company.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-800">
            <div className="bg-slate-950 p-6 text-white border-b border-slate-800">
              <h3 className="text-xl font-black uppercase tracking-tight">Register New Company</h3>
              <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Business registration details</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">SSM Number</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
                  value={formData.ssmNumber}
                  onChange={e => setFormData({...formData, ssmNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Contact Number</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-600"
                  value={formData.contactNumber}
                  onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Office Address</label>
                <textarea 
                  required
                  className="w-full px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 h-24 resize-none transition-all placeholder:text-slate-600"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">Add Company</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;