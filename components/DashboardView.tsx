
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { PatientRecord, Severity, Symptom } from '../types';

interface DashboardViewProps {
  records: PatientRecord[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const DashboardView: React.FC<DashboardViewProps> = ({ records }) => {
  const [filterDays, setFilterDays] = useState<number>(30);

  const filteredRecords = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - filterDays);
    return records.filter(r => new Date(r.timestamp) >= cutoff);
  }, [records, filterDays]);

  const alertedRecords = filteredRecords.filter(r => 
    r.temperature >= 100.4 || 
    r.oxygenLevel < 94 || 
    r.severity === Severity.HIGH || 
    r.severity === Severity.CRITICAL
  );

  const symptomCount: Record<string, number> = {};
  filteredRecords.forEach(r => {
    r.symptoms.forEach(s => {
      symptomCount[s] = (symptomCount[s] || 0) + 1;
    });
  });

  const symptomData = Object.entries(symptomCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const trendData = [...filteredRecords]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(r => ({
      date: new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      temp: r.temperature,
      hr: r.heartRate
    }));

  const avgTemp = filteredRecords.length ? filteredRecords.reduce((acc, r) => acc + r.temperature, 0) / filteredRecords.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <header>
          <h2 className="text-2xl font-black text-white tracking-tight">Health Overview</h2>
          <p className="text-slate-400 text-sm font-medium">Real-time surveillance monitoring and rule-based alerts</p>
        </header>
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-sm self-start md:self-auto">
          {[
            { label: '7D', value: 7 },
            { label: '30D', value: 30 },
            { label: '90D', value: 90 },
            { label: 'All', value: 365 },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterDays(f.value)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                filterDays === f.value ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Surveillance', value: filteredRecords.length, sub: 'Filtered Patients', icon: '👥', color: 'blue' },
          { label: 'Avg. Temperature', value: avgTemp.toFixed(1) + '°F', sub: 'Baseline 98.6', icon: '🌡️', color: 'orange' },
          { label: 'Alerts Triggered', value: alertedRecords.length, sub: 'Needs Review', icon: '⚠️', color: 'red' },
          { label: 'Leading Symptom', value: symptomData[0]?.name || 'N/A', sub: 'Most Frequent', icon: '📊', color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
              <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-${stat.color}-500/10 text-${stat.color}-400 border border-${stat.color}-500/20`}>
                Metric
              </span>
            </div>
            <h4 className="text-2xl font-black text-white tracking-tight">{stat.value}</h4>
            <p className="text-sm font-bold text-slate-300 mt-1">{stat.label}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            Patient Flow Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 700 }}
                />
                <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#0f172a' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Top Reported Symptoms
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomData.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 700 }} />
                <Tooltip 
                  cursor={{ fill: '#1e293b', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {symptomData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-red-950/20 flex justify-between items-center">
          <div>
            <h3 className="font-black text-white flex items-center gap-2 uppercase tracking-tight">
              <span className="text-red-500 animate-pulse">⚠️</span> Active Alerts
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Automatic flags for clinical severity and vitals outliers.</p>
          </div>
          <span className="bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {alertedRecords.length} Triggered
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Patient</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Trigger Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Level</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {alertedRecords.length > 0 ? alertedRecords.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-white">{r.patientName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{r.contactInfo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {r.temperature >= 100.4 && <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] font-black border border-red-500/20">TEMP: {r.temperature}°F</span>}
                      {r.oxygenLevel < 94 && <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded text-[10px] font-black border border-orange-500/20">O2: {r.oxygenLevel}%</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                      r.severity === Severity.CRITICAL ? 'bg-red-500 text-white border-red-500' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-600 font-black uppercase tracking-widest text-xs opacity-50 italic">
                    All vital signs within safety thresholds
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;