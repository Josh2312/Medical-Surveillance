
import React from 'react';
import { PatientRecord, Outcome } from '../types';

interface DashboardViewProps {
  records: PatientRecord[];
}

const DashboardView: React.FC<DashboardViewProps> = ({ records }) => {
  // Logic: 
  // Completed = Has an outcome set.
  // Uncompleted = No outcome set (undefined).
  // Fit = Outcome is FIT or FIT_CONDITIONAL
  // Unfit = Outcome is UNFIT

  const completedRecords = records.filter(r => r.outcome !== undefined && r.outcome !== null);
  const uncompletedRecords = records.filter(r => r.outcome === undefined || r.outcome === null);
  
  const completedCount = completedRecords.length;
  const uncompletedCount = uncompletedRecords.length;
  
  const fitCount = completedRecords.filter(r => 
    r.outcome === Outcome.FIT || r.outcome === Outcome.FIT_CONDITIONAL
  ).length;
  
  const unfitCount = completedRecords.filter(r => 
    r.outcome === Outcome.UNFIT
  ).length;

  const statCards = [
    {
      label: 'Completed Medical Reports',
      value: completedCount,
      color: 'blue',
      icon: '✅',
      desc: 'Reports finalized'
    },
    {
      label: 'Uncompleted Medical Reports',
      value: uncompletedCount,
      color: 'orange',
      icon: '⏳',
      desc: 'Pending finalization'
    },
    {
      label: 'Fit Workers',
      value: fitCount,
      color: 'emerald',
      icon: '💪',
      desc: 'Including conditional'
    },
    {
      label: 'Unfit Workers',
      value: unfitCount,
      color: 'red',
      icon: '🛑',
      desc: 'Requires intervention'
    }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-black text-white tracking-tight">Status Overview</h2>
        <p className="text-slate-400 text-sm font-medium">Summary of surveillance examinations and fitness outcomes</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none`}></div>
            
            <div className="flex justify-between items-start mb-6 relative">
              <span className="text-4xl filter drop-shadow-lg">{stat.icon}</span>
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-${stat.color}-500/10 text-${stat.color}-400 border border-${stat.color}-500/20`}>
                Metric
              </span>
            </div>
            
            <h4 className="text-4xl font-black text-white tracking-tighter mb-2">{stat.value}</h4>
            <p className="text-sm font-bold text-slate-200 uppercase tracking-tight">{stat.label}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{stat.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Optional: Simple List View for Uncompleted to be helpful */}
      {uncompletedCount > 0 && (
         <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden mt-8">
            <div className="p-6 border-b border-slate-800 bg-orange-950/10">
                <h3 className="font-black text-white flex items-center gap-2 uppercase tracking-tight text-sm">
                   ⏳ Pending Completion
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-800">
                        {uncompletedRecords.map(r => (
                            <tr key={r.id} className="hover:bg-slate-800/30">
                                <td className="px-6 py-4 text-xs font-bold text-white">{r.patientName}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">{r.companyName}</td>
                                <td className="px-6 py-4 text-xs text-slate-500">{new Date(r.timestamp).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] font-black text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20 uppercase">In Progress</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      )}
    </div>
  );
};

export default DashboardView;
