
import { PatientRecord, Symptom, Severity, Outcome, Company, Worker, Hazard, Ethnicity, MaritalStatus } from './types';

export const MOCK_COMPANIES: Company[] = [
  { 
    id: 'c1', 
    name: 'Global Manufacturing Ltd', 
    ssmNumber: '202101012345', 
    contactNumber: '03-8888-1234', 
    address: 'No. 1, Industrial Park, Shah Alam, Selangor', 
    workerCount: 2 
  },
  { 
    id: 'c2', 
    name: 'SafeTech Solutions', 
    ssmNumber: '201905056789', 
    contactNumber: '03-7777-5678', 
    address: 'Suite 10.02, Plaza Damansara, KL', 
    workerCount: 0 
  },
];

export const MOCK_WORKERS: Worker[] = [
  { 
    id: 'w1', 
    companyId: 'c1', 
    companyName: 'Global Manufacturing Ltd',
    name: 'John Doe', 
    age: 45,
    address: 'Lot 102, Kampung Baru, KL',
    icPassport: '850101-14-5555', 
    gender: 'Male',
    maritalStatus: MaritalStatus.MARRIED,
    noOfChildren: 3,
    ethnicity: Ethnicity.MALAY,
    isMalaysian: true,
    jobRole: 'Welder', 
    hazards: [Hazard.NOISE, Hazard.CHEMICAL] 
  },
  { 
    id: 'w2', 
    companyId: 'c1', 
    companyName: 'Global Manufacturing Ltd',
    name: 'Jane Smith', 
    age: 29,
    address: 'No. 4, Jalan SS2, PJ',
    icPassport: '920202-10-6666', 
    gender: 'Female',
    maritalStatus: MaritalStatus.SINGLE,
    noOfChildren: 0,
    ethnicity: Ethnicity.CHINESE,
    isMalaysian: true,
    jobRole: 'Operator', 
    hazards: [Hazard.DUST] 
  },
];

export const INITIAL_RECORDS: PatientRecord[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    visitDate: new Date(Date.now() - 3600000 * 2).toISOString().split('T')[0],
    patientName: 'John Doe',
    contactInfo: 'john.doe@email.com',
    age: 45,
    gender: 'Male',
    temperature: 101.2,
    heartRate: 88,
    oxygenLevel: 96,
    symptoms: [Symptom.FEVER, Symptom.COUGH],
    severity: Severity.MEDIUM,
    notes: 'Patient reports persistent cough for 3 days.',
    outcome: Outcome.FIT_CONDITIONAL,
    companyName: 'Global Manufacturing Ltd'
  }
];
