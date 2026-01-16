
import React, { useState, useEffect } from 'react';
import { Symptom, Severity, Outcome, Hazard, PatientRecord, Worker, SmokingStatus, Company } from '../types';

interface PatientFormProps {
  onAddRecord: (record: PatientRecord) => void;
  workers: Worker[];
  companies: Company[];
  initialData?: PatientRecord | null;
}

const PatientForm: React.FC<PatientFormProps> = ({ onAddRecord, workers, companies, initialData }) => {
  const [step, setStep] = useState(1);
  
  const defaultFormData = {
    patientName: '',
    companyName: '',
    icPassport: '',
    companyAddress: '',
    visitDate: new Date().toISOString().split('T')[0],
    age: 30,
    gender: 'Male',
    temperature: 98.6,
    heartRate: 72,
    oxygenLevel: 98,
    symptoms: [] as Symptom[],
    severity: Severity.LOW,
    notes: '',
    outcome: Outcome.FIT,
    hazards: [] as Hazard[],
    
    medicalHistory: {
      hasDisease: 'No',
      diseaseDetails: '',
      onMedication: 'No',
      medicationDetails: '',
      hospitalized: 'No',
      hospitalDetails: ''
    },
    personalHistory: {
      smoking: SmokingStatus.NON,
      smokingYears: '',
      smokingQty: '',
      vaping: 'No',
      vapingYears: '',
      alcohol: 'No',
      alcoholFrequency: '',
      socialNotes: ''
    },
    familyOtherHistory: {
      familyHistory: '',
      otherHistory: ''
    },
    occupationalHistory: {
      jobTitle: '',
      companyName: '',
      durationEmployment: '',
      durationExposureCHTH: '',
      incidentExposure: 'No',
      incidentDetails: ''
    },
    trainingHistory: {
      safeHandling: { status: 'No', notes: '' },
      recognizeSigns: { status: 'No', notes: '' },
      poisoningSigns: { status: 'No', notes: '' },
      ppeUsage: { status: 'No', notes: '' },
      usePPEWhenHandling: { status: 'No', notes: '' }
    },
    chemicalHealthEffects: {
      respiratory: [],
      cns: [],
      skinEyes: [],
      other: { details: '', notes: '' },
      currentHealthEffects: ''
    },
    physicalExam: {
      anthropometry: { weight: '', height: '', bmi: '' },
      vitalSigns: { bloodPressure: '', pulseRate: '', respiratoryRate: '' },
      generalAppearance: ''
    },
    organSystems: {
      cardiovascular: '',
      ent: '',
      eyes: '',
      gastrointestinal: '',
      haematology: '',
      kidney: '',
      liver: '',
      musculoskeletal: '',
      nervousCentral: '',
      nervousPeripheral: '',
      reproductive: '',
      skin: '',
      others: ''
    },
    targetOrganTest: [{ test: '', findings: '', comments: '' }],
    biologicalMonitoring: [{ determinant: '', result: '' }],
    
    respiratorFitness: {
      status: 'Fit',
      justification: ''
    },
    msConclusion: {
      historyChemicalExposure: 'No',
      historyChemicalExposureNotes: '',
      clinicalFindings: 'No',
      clinicalFindingsNotes: '',
      targetOrganResults: 'No',
      targetOrganNotes: '',
      beiResults: 'No',
      beiNotes: '',
      pregnancyStatus: 'No',
      fitnessToWork: 'Fit'
    },
    recommendation: {
      notesToEmployer: '',
      ohdName: '',
      clinicName: '',
      mmcNo: '',
      doshNo: '',
      phone: '',
      email: '',
      date: new Date().toISOString().split('T')[0]
    },
    summaryRecord: {
      workerName: '',
      chemicalName: '',
      msDate: new Date().toISOString().split('T')[0],
      healthEffectsCHTH: '',
      targetOrgan: '',
      beiDeterminant: '',
      workRelatedness: 'No',
      conclusion: 'Fit',
      mrpDate: '',
      ohdDoshReg: ''
    }
  };

  const [formData, setFormData] = useState<any>(defaultFormData);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData((prev: any) => ({
        ...prev,
        ...initialData,
        // Explicitly fallback to default structure if fields are missing in initialData
        medicalHistory: initialData.medicalHistory || defaultFormData.medicalHistory,
        personalHistory: initialData.personalHistory || defaultFormData.personalHistory,
        familyOtherHistory: initialData.familyOtherHistory || defaultFormData.familyOtherHistory,
        occupationalHistory: initialData.occupationalHistory || defaultFormData.occupationalHistory,
        trainingHistory: initialData.trainingHistory || defaultFormData.trainingHistory,
        chemicalHealthEffects: initialData.chemicalHealthEffects || defaultFormData.chemicalHealthEffects,
        physicalExam: initialData.physicalExam || defaultFormData.physicalExam,
        organSystems: initialData.organSystems || defaultFormData.organSystems,
        targetOrganTest: initialData.targetOrganTest || defaultFormData.targetOrganTest,
        biologicalMonitoring: initialData.biologicalMonitoring || defaultFormData.biologicalMonitoring,
        respiratorFitness: initialData.respiratorFitness || defaultFormData.respiratorFitness,
        msConclusion: initialData.msConclusion || defaultFormData.msConclusion,
        recommendation: initialData.recommendation || defaultFormData.recommendation,
        summaryRecord: initialData.summaryRecord || {
           ...defaultFormData.summaryRecord,
           workerName: initialData.patientName || ''
        }
      }));
    }
  }, [initialData]);

  // Calculate BMI automatically
  useEffect(() => {
    // Safety check to ensure physicalExam and anthropometry exist before accessing
    const anthropometry = formData.physicalExam?.anthropometry;
    
    if (anthropometry) {
      const weight = parseFloat(anthropometry.weight);
      const heightCm = parseFloat(anthropometry.height);
      if (weight > 0 && heightCm > 0) {
        const heightM = heightCm / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(1);
        
        // Only update if BMI has changed to avoid infinite loops
        if (bmi !== anthropometry.bmi) {
          setFormData((prev: any) => ({
            ...prev,
            physicalExam: {
              ...prev.physicalExam,
              anthropometry: { ...prev.physicalExam.anthropometry, bmi }
            }
          }));
        }
      }
    }
  }, [formData.physicalExam?.anthropometry?.weight, formData.physicalExam?.anthropometry?.height]);

  // Sync worker name to summary record when selected in step 1
  useEffect(() => {
    if (formData.patientName && !initialData) {
      setFormData((prev: any) => ({
        ...prev,
        summaryRecord: { ...prev.summaryRecord, workerName: formData.patientName }
      }));
    }
  }, [formData.patientName, initialData]);

  const handleWorkerSelect = (workerName: string) => {
    const worker = workers.find(w => w.name === workerName);
    const company = worker ? companies.find(c => c.id === worker.companyId) : null;
    
    if (worker) {
      setFormData({
        ...formData,
        patientName: worker.name,
        companyName: worker.companyName,
        icPassport: worker.icPassport,
        companyAddress: company ? company.address : '',
        age: worker.age,
        gender: worker.gender,
        hazards: worker.hazards,
        occupationalHistory: {
          ...formData.occupationalHistory,
          jobTitle: worker.jobRole,
          companyName: worker.companyName
        },
        summaryRecord: {
           ...formData.summaryRecord,
           workerName: worker.name
        }
      });
    } else {
      setFormData({ ...formData, patientName: workerName });
    }
  };

  const addRow = (field: string) => {
    if (field === 'targetOrganTest') {
      setFormData({ ...formData, targetOrganTest: [...formData.targetOrganTest, { test: '', findings: '', comments: '' }] });
    } else if (field === 'biologicalMonitoring') {
      setFormData({ ...formData, biologicalMonitoring: [...formData.biologicalMonitoring, { determinant: '', result: '' }] });
    }
  };

  const handleCheckboxChange = (category: 'respiratory' | 'cns' | 'skinEyes', value: string) => {
    const currentList = formData.chemicalHealthEffects[category];
    let newList;
    if (currentList.includes(value)) {
        newList = currentList.filter((item: string) => item !== value);
    } else {
        newList = [...currentList, value];
    }
    setFormData({
        ...formData,
        chemicalHealthEffects: {
            ...formData.chemicalHealthEffects,
            [category]: newList
        }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PatientRecord = {
      ...formData,
      id: initialData ? initialData.id : Math.random().toString(36).substr(2, 9),
      timestamp: initialData ? initialData.timestamp : new Date().toISOString()
    };
    onAddRecord(newRecord);
  };

  const inputClass = "w-full px-4 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-sm placeholder:text-slate-600";
  const labelClass = "block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5";
  const sectionTitle = "text-lg font-bold text-white border-b border-slate-800 pb-3 mb-6 flex items-center gap-3";

  const totalSteps = 14;

  return (
    <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden mb-12">
      <div className="bg-slate-950 p-8 text-white flex justify-between items-center border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black tracking-tight">{initialData ? 'Edit Examination Report' : 'Medical Surveillance Programme: Examination Form'}</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Occupational Health Surveillance Registry</p>
        </div>
        <div className="flex gap-1.5 flex-wrap max-w-md justify-end">
          {Array.from({length: totalSteps}, (_, i) => i + 1).map(s => (
            <div key={s} className={`w-3 h-1 md:w-6 md:h-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-800'}`}></div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className={sectionTitle}><span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-black">01</span> Worker Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Select Worker Registry</label>
                <select className={inputClass} value={formData.patientName} onChange={(e) => handleWorkerSelect(e.target.value)} required>
                  <option value="" className="bg-slate-900">-- Search Registry --</option>
                  {workers.map(w => <option key={w.id} value={w.name} className="bg-slate-900">{w.name} ({w.icPassport})</option>)}
                </select>
              </div>
              <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Worker Profile Link</p>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase font-bold">Company</span>
                    <span className="text-slate-200 font-bold">{formData.companyName || '---'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase font-bold">IC / Passport</span>
                    <span className="text-slate-200 font-bold">{formData.icPassport || '---'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase font-bold">Age/Gender</span>
                    <span className="text-slate-200 font-bold">{formData.age}y / {formData.gender}</span>
                  </div>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setStep(2)} disabled={!formData.patientName} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${formData.patientName ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
              Medical Records
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <h3 className={sectionTitle}>Medical History</h3>
             <div className="space-y-6">
              {['hasDisease', 'onMedication', 'hospitalized'].map((k, i) => (
                <div key={k} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                  <div>
                    <label className={labelClass}>{i + 1}. {k === 'hasDisease' ? 'Diagnosed with any disease?' : k === 'onMedication' ? 'Medication or follow up?' : 'Ever hospitalized?'}</label>
                    <select className={inputClass} value={formData.medicalHistory[k]} onChange={e => setFormData({...formData, medicalHistory: {...formData.medicalHistory, [k]: e.target.value}})}>
                      <option className="bg-slate-900">No</option><option className="bg-slate-900">Yes</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Details (if Yes)</label>
                    <input className={inputClass} value={formData.medicalHistory[k + 'Details']} onChange={e => {
                        const detailKey = k === 'hasDisease' ? 'diseaseDetails' : k === 'onMedication' ? 'medicationDetails' : 'hospitalDetails';
                        setFormData({...formData, medicalHistory: {...formData.medicalHistory, [detailKey]: e.target.value}});
                    }} />
                  </div>
                </div>
              ))}
            </div>
             <div className="flex gap-4"><button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold">Back</button><button type="button" onClick={() => setStep(3)} className="flex-[2] bg-blue-600 py-4 rounded-2xl font-bold shadow-lg">Next</button></div>
          </div>
        )}
        
        {step > 2 && step < 12 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
               {step === 3 && (
                 <div className="space-y-6">
                   <h3 className={sectionTitle}>Personal & Social History</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4 bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                          <label className={labelClass}>Smoking Status</label>
                          <select className={inputClass} value={formData.personalHistory.smoking} onChange={e => setFormData({...formData, personalHistory: {...formData.personalHistory, smoking: e.target.value as SmokingStatus}})}>
                          {Object.values(SmokingStatus).map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                          </select>
                          <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelClass}>No. Years</label><input type="number" className={inputClass} value={formData.personalHistory.smokingYears} onChange={e => setFormData({...formData, personalHistory: {...formData.personalHistory, smokingYears: e.target.value}})} /></div>
                          <div><label className={labelClass}>Cigarettes/Day</label><input type="number" className={inputClass} value={formData.personalHistory.smokingQty} onChange={e => setFormData({...formData, personalHistory: {...formData.personalHistory, smokingQty: e.target.value}})} /></div>
                          </div>
                      </div>
                      <div className="space-y-4 bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                          <label className={labelClass}>Vaping</label>
                          <div className="grid grid-cols-2 gap-4">
                              <select className={inputClass} value={formData.personalHistory.vaping} onChange={e => setFormData({...formData, personalHistory: {...formData.personalHistory, vaping: e.target.value}})}><option>No</option><option>Yes</option></select>
                              <div><label className={labelClass}>No. Years</label><input type="number" className={inputClass} value={formData.personalHistory.vapingYears} onChange={e => setFormData({...formData, personalHistory: {...formData.personalHistory, vapingYears: e.target.value}})} /></div>
                          </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-800">
                      <div className="space-y-2">
                        <label className={labelClass}>Relevant Family History</label>
                        <textarea 
                          className={`${inputClass} h-32 resize-none`} 
                          placeholder="e.g. Hypertension, Diabetes, Asthma in family..." 
                          value={formData.familyOtherHistory.familyHistory}
                          onChange={e => setFormData({
                            ...formData, 
                            familyOtherHistory: {
                              ...formData.familyOtherHistory, 
                              familyHistory: e.target.value
                            }
                          })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>Other History (If Relevant)</label>
                        <textarea 
                          className={`${inputClass} h-32 resize-none`} 
                          placeholder="Any other relevant medical or social history..." 
                          value={formData.familyOtherHistory.otherHistory}
                          onChange={e => setFormData({
                            ...formData, 
                            familyOtherHistory: {
                              ...formData.familyOtherHistory, 
                              otherHistory: e.target.value
                            }
                          })} 
                        />
                      </div>
                   </div>
                 </div>
               )}
               {step === 4 && (
                 <div className="space-y-6">
                    <h3 className={sectionTitle}>Occupational History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                      <div><label className={labelClass}>Job Title</label><input className={inputClass} value={formData.occupationalHistory.jobTitle} onChange={e => setFormData({...formData, occupationalHistory: {...formData.occupationalHistory, jobTitle: e.target.value}})} /></div>
                      <div>
                        <label className={labelClass}>Company</label>
                        <select className={inputClass} value={formData.occupationalHistory.companyName} onChange={e => setFormData({...formData, occupationalHistory: {...formData.occupationalHistory, companyName: e.target.value}})}>
                          <option value="" className="bg-slate-900">Select Company</option>
                          {companies.map(c => (<option key={c.id} value={c.name} className="bg-slate-900">{c.name}</option>))}
                        </select>
                      </div>
                      <div><label className={labelClass}>Duration Employment</label><input className={inputClass} value={formData.occupationalHistory.durationEmployment} onChange={e => setFormData({...formData, occupationalHistory: {...formData.occupationalHistory, durationEmployment: e.target.value}})} /></div>
                      <div><label className={labelClass}>Duration Exposure CHTH</label><input className={inputClass} value={formData.occupationalHistory.durationExposureCHTH} onChange={e => setFormData({...formData, occupationalHistory: {...formData.occupationalHistory, durationExposureCHTH: e.target.value}})} /></div>
                    </div>
                 </div>
               )}
               {step === 5 && (
                 <div className="space-y-6">
                   <h3 className={sectionTitle}>History of Training</h3>
                    <div className="space-y-3">
                      {['safeHandling', 'recognizeSigns', 'poisoningSigns', 'ppeUsage'].map((tk) => (
                        <div key={tk} className="grid grid-cols-12 gap-4 items-center bg-slate-950/30 p-4 rounded-2xl border border-slate-800">
                          <div className="col-span-12 md:col-span-6"><p className="text-sm font-bold text-slate-200 uppercase tracking-tight">{tk.replace(/([A-Z])/g, ' $1')}</p></div>
                          <div className="col-span-4 md:col-span-2"><select className={inputClass} value={formData.trainingHistory[tk].status} onChange={e => setFormData({...formData, trainingHistory: {...formData.trainingHistory, [tk]: {...formData.trainingHistory[tk], status: e.target.value}}})}><option>No</option><option>Yes</option></select></div>
                          <div className="col-span-8 md:col-span-4"><input className={inputClass} placeholder="Notes..." value={formData.trainingHistory[tk].notes} onChange={e => setFormData({...formData, trainingHistory: {...formData.trainingHistory, [tk]: {...formData.trainingHistory[tk], notes: e.target.value}}})} /></div>
                        </div>
                      ))}
                    </div>

                    {/* NEW SECTION: History of Health Effects */}
                    <div className="mt-8 pt-8 border-t border-slate-800 animate-in fade-in slide-in-from-right-4">
                       <h3 className={sectionTitle}>History of Health Effects Due to Chemical Exposure</h3>
                       
                       {/* Respiratory */}
                       <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800 mb-6">
                           <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-4">Respiratory</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {['Breathing discomfort or difficulty', 'Cough', 'Sore throat', 'Sneezing'].map(opt => (
                                   <label key={opt} className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-blue-500/50 transition-colors">
                                       <input 
                                           type="checkbox" 
                                           className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/20"
                                           checked={formData.chemicalHealthEffects.respiratory.includes(opt)}
                                           onChange={() => handleCheckboxChange('respiratory', opt)}
                                       />
                                       <span className="text-sm text-slate-300 font-medium">{opt}</span>
                                   </label>
                               ))}
                           </div>
                       </div>
                       
                       {/* CNS */}
                       <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800 mb-6">
                           <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-4">Central Nervous System</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {['Drowsiness', 'Dizziness', 'Headache', 'Confusion/Lethargy', 'Nausea and Vomiting'].map(opt => (
                                   <label key={opt} className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-blue-500/50 transition-colors">
                                       <input 
                                           type="checkbox" 
                                           className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/20"
                                           checked={formData.chemicalHealthEffects.cns.includes(opt)}
                                           onChange={() => handleCheckboxChange('cns', opt)}
                                       />
                                       <span className="text-sm text-slate-300 font-medium">{opt}</span>
                                   </label>
                               ))}
                           </div>
                       </div>

                       {/* Skin & Eyes */}
                       <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800 mb-6">
                           <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-4">Skin and Eyes</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {['Eyes irritations', 'Blurred Vision', 'Blisters', 'Burns', 'Itching', 'Rash and Redness'].map(opt => (
                                   <label key={opt} className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 cursor-pointer hover:border-blue-500/50 transition-colors">
                                       <input 
                                           type="checkbox" 
                                           className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/20"
                                           checked={formData.chemicalHealthEffects.skinEyes.includes(opt)}
                                           onChange={() => handleCheckboxChange('skinEyes', opt)}
                                       />
                                       <span className="text-sm text-slate-300 font-medium">{opt}</span>
                                   </label>
                               ))}
                           </div>
                       </div>

                       {/* Other */}
                       <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800 mb-6">
                           <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-4">Other</h4>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                   <label className={labelClass}>Elaborate Frequency, Severity etc.</label>
                                   <input 
                                        className={inputClass} 
                                        value={formData.chemicalHealthEffects.other.details}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            chemicalHealthEffects: {
                                                ...formData.chemicalHealthEffects,
                                                other: { ...formData.chemicalHealthEffects.other, details: e.target.value }
                                            }
                                        })}
                                   />
                               </div>
                               <div>
                                   <label className={labelClass}>Notes</label>
                                   <input 
                                        className={inputClass} 
                                        value={formData.chemicalHealthEffects.other.notes}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            chemicalHealthEffects: {
                                                ...formData.chemicalHealthEffects,
                                                other: { ...formData.chemicalHealthEffects.other, notes: e.target.value }
                                            }
                                        })}
                                   />
                               </div>
                           </div>
                       </div>

                       {/* Clinical Findings */}
                       <h3 className={sectionTitle}>Clinical Findings</h3>
                       <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                           <label className={labelClass}>Current Health Effects Due To CHTH exposure (Notes)</label>
                           <textarea 
                                className={`${inputClass} h-32 resize-none`} 
                                value={formData.chemicalHealthEffects.currentHealthEffects}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    chemicalHealthEffects: {
                                        ...formData.chemicalHealthEffects,
                                        currentHealthEffects: e.target.value
                                    }
                                })}
                           />
                       </div>

                   </div>
                 </div>
               )}
               {step === 6 && (
                 <div className="space-y-6">
                   <h3 className={sectionTitle}>Physical Examination</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6 bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">a. Anthropometry</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className={labelClass}>Weight (kg)</label>
                            <input type="number" className={inputClass} value={formData.physicalExam.anthropometry.weight} onChange={e => setFormData({...formData, physicalExam: {...formData.physicalExam, anthropometry: {...formData.physicalExam.anthropometry, weight: e.target.value}}})} />
                          </div>
                          <div>
                            <label className={labelClass}>Height (cm)</label>
                            <input type="number" className={inputClass} value={formData.physicalExam.anthropometry.height} onChange={e => setFormData({...formData, physicalExam: {...formData.physicalExam, anthropometry: {...formData.physicalExam.anthropometry, height: e.target.value}}})} />
                          </div>
                          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <label className={labelClass}>BMI (kg/m²)</label>
                            <p className="text-2xl font-black text-white">{formData.physicalExam.anthropometry.bmi || '--.-'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6 bg-slate-950/30 p-6 rounded-2xl border border-slate-800">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">b. Vital Signs</h4>
                        <div className="space-y-4">
                          <div>
                            <label className={labelClass}>Blood Pressure (mm/Hg)</label>
                            <input className={inputClass} placeholder="e.g. 120/80" value={formData.physicalExam.vitalSigns.bloodPressure} onChange={e => setFormData({...formData, physicalExam: {...formData.physicalExam, vitalSigns: {...formData.physicalExam.vitalSigns, bloodPressure: e.target.value}}})} />
                          </div>
                          <div>
                            <label className={labelClass}>Pulse Rate (bpm)</label>
                            <input type="number" className={inputClass} value={formData.physicalExam.vitalSigns.pulseRate} onChange={e => setFormData({...formData, physicalExam: {...formData.physicalExam, vitalSigns: {...formData.physicalExam.vitalSigns, pulseRate: e.target.value}}})} />
                          </div>
                          <div>
                            <label className={labelClass}>Respiratory Rate</label>
                            <input type="number" className={inputClass} value={formData.physicalExam.vitalSigns.respiratoryRate} onChange={e => setFormData({...formData, physicalExam: {...formData.physicalExam, vitalSigns: {...formData.physicalExam.vitalSigns, respiratoryRate: e.target.value}}})} />
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
               )}
               {step === 7 && (
                 <div className="space-y-6">
                   <h3 className={sectionTitle}>Organ / System Examination</h3>
                   <div className="bg-slate-950/30 rounded-2xl border border-slate-800 overflow-hidden">
                      <div className="grid grid-cols-12 bg-slate-950 border-b border-slate-800 p-4">
                        <div className="col-span-1 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">No</div>
                        <div className="col-span-5 text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Organ / System</div>
                        <div className="col-span-6 text-[10px] font-black text-slate-500 uppercase tracking-widest pl-4">Clinical Findings</div>
                      </div>
                      <div className="divide-y divide-slate-800">
                        {[
                          { label: 'Cardiovascular System', key: 'cardiovascular' },
                          { label: 'Ear, Nose and Throat', key: 'ent' },
                          { label: 'Eyes', key: 'eyes' },
                          { label: 'Gastrointestinal', key: 'gastrointestinal' },
                          { label: 'Haematology', key: 'haematology' },
                          { label: 'Kidney', key: 'kidney' },
                          { label: 'Liver', key: 'liver' },
                          { label: 'Musculoskeletal', key: 'musculoskeletal' },
                          { label: 'Nervous system: Central and Peripheral', key: 'nervousCentral' },
                          { label: 'Reproductive', key: 'reproductive' },
                          { label: 'Skin', key: 'skin' },
                          { label: 'Others', key: 'others' }
                        ].map((item, idx) => (
                          <div key={item.key} className="grid grid-cols-12 items-center p-3 hover:bg-slate-800/20 transition-colors">
                            <div className="col-span-1 text-xs font-black text-slate-500 text-center">{idx + 1}</div>
                            <div className="col-span-5 text-sm font-bold text-slate-200 pl-4">{item.label}</div>
                            <div className="col-span-6 pl-4">
                              <input className={inputClass} value={formData.organSystems[item.key]} onChange={e => setFormData({...formData, organSystems: {...formData.organSystems, [item.key]: e.target.value}})} placeholder={`Findings for ${item.label}...`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </div>
               )}
               {step === 8 && (
                 <div className="space-y-6">
                   <h3 className={sectionTitle}>Target Organ Junction Test</h3>
                   <div className="bg-slate-950/30 rounded-2xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-950 border-b border-slate-800">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Test</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Result / Findings</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Comments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {formData.targetOrganTest.map((row: any, idx: number) => (
                            <tr key={idx}>
                              <td className="p-2"><input className={inputClass} value={row.test} onChange={e => {
                                const newArr = [...formData.targetOrganTest];
                                newArr[idx].test = e.target.value;
                                setFormData({...formData, targetOrganTest: newArr});
                              }} /></td>
                              <td className="p-2"><input className={inputClass} value={row.findings} onChange={e => {
                                const newArr = [...formData.targetOrganTest];
                                newArr[idx].findings = e.target.value;
                                setFormData({...formData, targetOrganTest: newArr});
                              }} /></td>
                              <td className="p-2"><input className={inputClass} value={row.comments} onChange={e => {
                                const newArr = [...formData.targetOrganTest];
                                newArr[idx].comments = e.target.value;
                                setFormData({...formData, targetOrganTest: newArr});
                              }} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button type="button" onClick={() => addRow('targetOrganTest')} className="text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">+ Add Test Row</button>
                 </div>
               )}
               {step === 9 && (
                 <div className="space-y-6">
                   <h3 className={sectionTitle}>Biological Monitoring</h3>
                   <div className="bg-slate-950/30 rounded-2xl border border-slate-800 overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-950 border-b border-slate-800">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Biological Exposure Indices determinants (BM/BEM)</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Results</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {formData.biologicalMonitoring.map((row: any, idx: number) => (
                            <tr key={idx}>
                              <td className="p-2"><input className={inputClass} value={row.determinant} onChange={e => {
                                const newArr = [...formData.biologicalMonitoring];
                                newArr[idx].determinant = e.target.value;
                                setFormData({...formData, biologicalMonitoring: newArr});
                              }} /></td>
                              <td className="p-2"><input className={inputClass} value={row.result} onChange={e => {
                                const newArr = [...formData.biologicalMonitoring];
                                newArr[idx].result = e.target.value;
                                setFormData({...formData, biologicalMonitoring: newArr});
                              }} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button type="button" onClick={() => addRow('biologicalMonitoring')} className="text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">+ Add Determinant Row</button>
                 </div>
               )}
               {step === 10 && (
                 <div className="space-y-6">
                   <h3 className={sectionTitle}>Certification & Medical Decision</h3>
                   <div className="grid grid-cols-1 gap-8">
                      <div className="bg-slate-950/30 p-8 rounded-3xl border border-slate-800">
                        <label className={labelClass}>Medical Fitness Determination</label>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          {Object.values(Outcome).map(o => (
                            <button key={o} type="button" onClick={() => setFormData({...formData, outcome: o})} className={`p-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${formData.outcome === o ? 'border-blue-600 bg-blue-600/20 text-blue-400' : 'border-slate-800 bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>
                              {o}
                            </button>
                          ))}
                        </div>
                        <label className={labelClass}>Clinical Findings & Recommendations</label>
                        <textarea className={`${inputClass} h-40 resize-none`} placeholder="Enter final clinical assessment, management plan, and work restrictions if any..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                      </div>
                    </div>
                 </div>
               )}
               {step === 11 && (
                 <div className="space-y-6">
                   <h3 className={sectionTitle}>Assessment on the Fitness to wear respirator where applicable</h3>
                   <div className="bg-slate-950/30 p-8 rounded-3xl border border-slate-800 space-y-6">
                      <div>
                        <label className={labelClass}>Assessment Status</label>
                        <select className={inputClass} value={formData.respiratorFitness.status} onChange={e => setFormData({...formData, respiratorFitness: {...formData.respiratorFitness, status: e.target.value}})}>
                          <option className="bg-slate-900" value="Fit">Fit</option>
                          <option className="bg-slate-900" value="Unfit">Unfit</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Please justify (Notes)</label>
                        <textarea className={`${inputClass} h-32 resize-none`} placeholder="Enter justification for the assessment..." value={formData.respiratorFitness.justification} onChange={e => setFormData({...formData, respiratorFitness: {...formData.respiratorFitness, justification: e.target.value}})} />
                      </div>
                    </div>
                 </div>
               )}
               
               <div className="flex gap-4 mt-6">
                 <button type="button" onClick={() => setStep(step - 1)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold">Back</button>
                 <button type="button" onClick={() => setStep(step + 1)} className="flex-[2] bg-blue-600 py-4 rounded-2xl font-bold shadow-lg">Next</button>
               </div>
            </div>
        )}

        {/* Step 12: Conclusion of MS Findings */}
        {step === 12 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className={sectionTitle}>Conclusion of MS Findings</h3>
            <div className="bg-slate-950/30 p-8 rounded-3xl border border-slate-800 space-y-6">
              
              <div className="space-y-2">
                <label className={labelClass}>History of health due to chemical(s) exposure</label>
                <select className={inputClass} value={formData.msConclusion.historyChemicalExposure} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, historyChemicalExposure: e.target.value}})}>
                  <option className="bg-slate-900" value="No">No</option><option className="bg-slate-900" value="Yes">Yes</option>
                </select>
                {formData.msConclusion.historyChemicalExposure === 'Yes' && (
                  <textarea className={`${inputClass} h-24 resize-none mt-2`} placeholder="Provide details..." value={formData.msConclusion.historyChemicalExposureNotes} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, historyChemicalExposureNotes: e.target.value}})} />
                )}
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Clinical Findings</label>
                <select className={inputClass} value={formData.msConclusion.clinicalFindings} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, clinicalFindings: e.target.value}})}>
                  <option className="bg-slate-900" value="No">No</option><option className="bg-slate-900" value="Yes">Yes</option>
                </select>
                {formData.msConclusion.clinicalFindings === 'Yes' && (
                   <textarea className={`${inputClass} h-24 resize-none mt-2`} placeholder="Provide details..." value={formData.msConclusion.clinicalFindingsNotes} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, clinicalFindingsNotes: e.target.value}})} />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className={labelClass}>Target Organ Function Test Results (Abnormal?)</label>
                    <select className={inputClass} value={formData.msConclusion.targetOrganResults} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, targetOrganResults: e.target.value}})}>
                      <option className="bg-slate-900" value="No">No</option><option className="bg-slate-900" value="Yes">Yes</option>
                    </select>
                 </div>
                 <div>
                    <label className={labelClass}>Notes</label>
                    <textarea className={`${inputClass} h-24 resize-none`} value={formData.msConclusion.targetOrganNotes} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, targetOrganNotes: e.target.value}})} />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className={labelClass}>BEI determinant (BM/BEM) Result (Abnormal?)</label>
                    <select className={inputClass} value={formData.msConclusion.beiResults} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, beiResults: e.target.value}})}>
                      <option className="bg-slate-900" value="No">No</option><option className="bg-slate-900" value="Yes">Yes</option>
                    </select>
                 </div>
                 <div>
                    <label className={labelClass}>Notes</label>
                    <textarea className={`${inputClass} h-24 resize-none`} value={formData.msConclusion.beiNotes} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, beiNotes: e.target.value}})} />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Pregnancy / Breast Feeding</label>
                  <select className={inputClass} value={formData.msConclusion.pregnancyStatus} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, pregnancyStatus: e.target.value}})}>
                    <option className="bg-slate-900" value="No">No</option><option className="bg-slate-900" value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Conclusion of fitness to work</label>
                  <select className={inputClass} value={formData.msConclusion.fitnessToWork} onChange={e => setFormData({...formData, msConclusion: {...formData.msConclusion, fitnessToWork: e.target.value}})}>
                    <option className="bg-slate-900" value="Fit">Fit</option><option className="bg-slate-900" value="Not Fit">Not Fit</option>
                  </select>
                </div>
              </div>

            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(11)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold">Back</button>
              <button type="button" onClick={() => setStep(13)} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-[0.99]">Next</button>
            </div>
          </div>
        )}

        {/* Step 13: Recommendation */}
        {step === 13 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className={sectionTitle}>Recommendation</h3>
            <div className="bg-slate-950/30 p-8 rounded-3xl border border-slate-800 space-y-8">
              
              <div>
                <label className={labelClass}>Recommendation to Employer</label>
                <textarea 
                  className={`${inputClass} h-40 resize-none`} 
                  placeholder="Enter specific recommendations, restrictions, or follow-up actions..."
                  value={formData.recommendation.notesToEmployer} 
                  onChange={e => setFormData({...formData, recommendation: {...formData.recommendation, notesToEmployer: e.target.value}})} 
                />
              </div>

              <div className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                <p className="text-sm italic text-slate-400 font-serif">"The Implication of the above results has been explained by the OHD"</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Name of Occupational Health Doctor</label>
                  <input className={inputClass} value={formData.recommendation.ohdName} onChange={e => setFormData({...formData, recommendation: {...formData.recommendation, ohdName: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>Name of Clinic</label>
                  <input className={inputClass} value={formData.recommendation.clinicName} onChange={e => setFormData({...formData, recommendation: {...formData.recommendation, clinicName: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>MMC No.</label>
                  <input className={inputClass} value={formData.recommendation.mmcNo} onChange={e => setFormData({...formData, recommendation: {...formData.recommendation, mmcNo: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>DOSH Registration No.</label>
                  <input className={inputClass} value={formData.recommendation.doshNo} onChange={e => setFormData({...formData, recommendation: {...formData.recommendation, doshNo: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>Clinic Telephone Number</label>
                  <input className={inputClass} value={formData.recommendation.phone} onChange={e => setFormData({...formData, recommendation: {...formData.recommendation, phone: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} value={formData.recommendation.email} onChange={e => setFormData({...formData, recommendation: {...formData.recommendation, email: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" className={inputClass} value={formData.recommendation.date} onChange={e => setFormData({...formData, recommendation: {...formData.recommendation, date: e.target.value}})} />
                </div>
              </div>

            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(12)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold">Back</button>
              <button type="button" onClick={() => setStep(14)} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-[0.99]">Next</button>
            </div>
          </div>
        )}

        {/* Step 14: Summary Records of Employee */}
        {step === 14 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <h3 className={sectionTitle}>Summary Records of Employee</h3>
            <div className="bg-slate-950/30 p-8 rounded-3xl border border-slate-800 space-y-6">
              
              <div>
                <label className={labelClass}>Name of Worker</label>
                <select 
                  className={inputClass} 
                  value={formData.summaryRecord.workerName} 
                  onChange={(e) => setFormData({...formData, summaryRecord: {...formData.summaryRecord, workerName: e.target.value}})}
                >
                  <option value="" className="bg-slate-900">-- Select Worker --</option>
                  {workers.map(w => <option key={w.id} value={w.name} className="bg-slate-900">{w.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Name of Chemical</label>
                  <input className={inputClass} value={formData.summaryRecord.chemicalName} onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, chemicalName: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>Ms Date</label>
                  <input type="date" className={inputClass} value={formData.summaryRecord.msDate} onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, msDate: e.target.value}})} />
                </div>
              </div>

              <div>
                <label className={labelClass}>History of health effects due to CHTH exposure</label>
                <textarea className={`${inputClass} h-24 resize-none`} value={formData.summaryRecord.healthEffectsCHTH} onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, healthEffectsCHTH: e.target.value}})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Target organ (Specify organ)</label>
                  <input className={inputClass} value={formData.summaryRecord.targetOrgan} onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, targetOrgan: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>BEI Determinant</label>
                  <input className={inputClass} value={formData.summaryRecord.beiDeterminant} onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, beiDeterminant: e.target.value}})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Work relatedness</label>
                  <select 
                    className={inputClass} 
                    value={formData.summaryRecord.workRelatedness} 
                    onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, workRelatedness: e.target.value}})}
                  >
                    <option className="bg-slate-900" value="No">No</option>
                    <option className="bg-slate-900" value="Yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Conclusion of MS findings</label>
                  <select 
                    className={inputClass} 
                    value={formData.summaryRecord.conclusion} 
                    onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, conclusion: e.target.value}})}
                  >
                    <option className="bg-slate-900" value="Fit">Fit</option>
                    <option className="bg-slate-900" value="Unfit">Unfit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Date of MRP</label>
                  <input type="date" className={inputClass} value={formData.summaryRecord.mrpDate} onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, mrpDate: e.target.value}})} />
                </div>
                <div>
                  <label className={labelClass}>Name of OHD/DOSH Reg. No.</label>
                  <input className={inputClass} value={formData.summaryRecord.ohdDoshReg} onChange={e => setFormData({...formData, summaryRecord: {...formData.summaryRecord, ohdDoshReg: e.target.value}})} />
                </div>
              </div>

            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(13)} className="flex-1 bg-slate-800 py-4 rounded-2xl font-bold">Back</button>
              <button type="submit" className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 transition-all active:scale-[0.99] uppercase tracking-widest">Finalize Report & Generate</button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default PatientForm;
