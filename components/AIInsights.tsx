
import React, { useState } from 'react';
import { analyzeSurveillanceData } from '../services/geminiService';
import { PatientRecord } from '../types';

interface AIInsightsProps { record: PatientRecord[]; }

const AIInsights: React.FC<any> = ({ records }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeSurveillanceData(records);
      setAnalysis(result);
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
        <div className="flex-1">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase">
            <span>🧠</span> AI Surveillance Analysis
          </h2>
          <p className="text-blue-100 mt-2 max-w-xl font-medium text-sm leading-relaxed">
            Detect anomalies, correlate multi-factor symptoms, and identify emerging infectious disease patterns across your registry using neural network processing.
          </p>
        </div>
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-8 py-4 bg-white text-indigo-700 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'}`}
        >
          {loading ? 'Processing Registry...' : 'Generate Risk Intelligence'}
        </button>
      </div>

      {!analysis && !loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-3xl border border-dashed border-slate-700">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-slate-700 grayscale opacity-40">
            🧬
          </div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Awaiting Data Processing Instruction</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900 rounded-3xl border border-slate-800 animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-400 font-black uppercase tracking-widest text-xs">Scanning Symptoms & Vitals...</p>
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-sm">
              <h3 className="text-lg font-black text-white mb-4 uppercase tracking-tight">System Summary</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                {analysis.summary}
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-sm">
              <h3 className="text-lg font-black text-white mb-6 uppercase tracking-tight">Key Findings</h3>
              <div className="grid gap-4">
                {analysis.findings.map((finding: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 flex gap-4 hover:border-slate-700 transition-all group">
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-lg ${finding.concernLevel === 'High' ? 'bg-red-600 shadow-red-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
                      !
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{finding.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 font-medium">{finding.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-8 rounded-3xl border flex flex-col items-center text-center ${
              analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical' 
                ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg shadow-red-500/5' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/5'
            }`}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3">Threat Assessment</p>
              <h3 className="text-4xl font-black tracking-tighter mb-2">{analysis.riskLevel}</h3>
              <div className="w-16 h-1 bg-current opacity-20 rounded-full mb-4"></div>
              <p className="text-xs opacity-70 font-bold uppercase tracking-wider leading-relaxed">System scan suggests immediate protocol check.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-sm">
              <h3 className="text-lg font-black text-white mb-5 uppercase tracking-tight">Recommendations</h3>
              <ul className="space-y-4">
                {analysis.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <span className="text-blue-500 font-bold group-hover:scale-125 transition-transform">✓</span>
                    <span className="text-sm text-slate-400 font-bold group-hover:text-slate-200 transition-colors">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;