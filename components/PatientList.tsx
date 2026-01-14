
import React, { useState, useRef } from 'react';
import { PatientRecord, Severity, Outcome } from '../types';

interface PatientListProps {
  records: PatientRecord[];
  onUpdateRecord: (record: PatientRecord) => void;
  onEditRecord: (record: PatientRecord) => void;
}

const PatientList: React.FC<PatientListProps> = ({ records, onUpdateRecord, onEditRecord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = records.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.companyName && r.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getOutcomeBadge = (o?: Outcome) => {
    switch(o) {
      case Outcome.FIT: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case Outcome.UNFIT: return 'bg-red-500/10 text-red-400 border-red-500/20';
      case Outcome.FIT_CONDITIONAL: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const handleUploadClick = (id: string) => {
    setUploadingId(id);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && uploadingId) {
      const file = e.target.files[0];
      const recordToUpdate = records.find(r => r.id === uploadingId);
      
      if (recordToUpdate) {
        // Create a fake URL for the uploaded file (simulation)
        const fileUrl = URL.createObjectURL(file);
        const updatedRecord: PatientRecord = {
          ...recordToUpdate,
          externalReport: {
            fileName: file.name,
            fileUrl: fileUrl,
            uploadDate: new Date().toISOString()
          }
        };
        onUpdateRecord(updatedRecord);
      }
      setUploadingId(null);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />

      <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/50">
        <div>
          <h3 className="font-black text-white tracking-tight uppercase text-sm">Active Surveillance Registry</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">Tracking {filtered.length} workers in database</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search Worker / Company..." 
            className="flex-1 px-4 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-sm text-white outline-none focus:ring-4 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/30">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Worker / Employer</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vitals Summary</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Medical Outcome</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Report Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(record => (
              <tr key={record.id} className="hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-sm font-black text-blue-400 border border-blue-500/20">
                      {record.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white leading-none mb-1.5 group-hover:text-blue-400 transition-colors">{record.patientName}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{record.companyName || 'General Intake'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">🌡️ {record.temperature}°F</span>
                    <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">🫁 {record.oxygenLevel}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 border rounded-lg text-[10px] font-black uppercase tracking-widest ${getOutcomeBadge(record.outcome)}`}>
                    {record.outcome || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start gap-2">
                    <button 
                      onClick={() => onEditRecord(record)}
                      className="text-[10px] font-black text-blue-400 uppercase border-b-2 border-transparent hover:border-blue-400 transition-all tracking-widest"
                    >
                      📄 Edit / View Report
                    </button>
                    
                    {record.externalReport ? (
                      <div className="flex items-center gap-2 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-300 truncate max-w-[100px]">{record.externalReport.fileName}</span>
                        <a href={record.externalReport.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-400 hover:text-blue-300">View</a>
                        <button onClick={() => handleUploadClick(record.id)} className="text-[10px] font-black text-slate-500 hover:text-white ml-1">↻</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleUploadClick(record.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-700 transition-all"
                      >
                        <span className="text-lg leading-none">+</span> Upload Doc
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
