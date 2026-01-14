
export enum UserRole {
  ADMIN = 'Admin',
  CLINICIAN = 'Clinician',
  COMPANY_HR = 'Company HR'
}

export enum Hazard {
  NOISE = 'Noise',
  CHEMICAL = 'Chemical',
  DUST = 'Dust',
  ERGONOMIC = 'Ergonomic',
  BIOLOGICAL = 'Biological'
}

export enum Outcome {
  FIT = 'Fit',
  UNFIT = 'Unfit',
  FIT_CONDITIONAL = 'Fit with Conditions'
}

export enum Ethnicity {
  MALAY = 'Malay',
  INDIAN = 'Indian',
  CHINESE = 'Chinese',
  OTHERS = 'Others'
}

export enum MaritalStatus {
  SINGLE = 'Single',
  MARRIED = 'Married',
  DIVORCED = 'Divorced',
  WIDOWED = 'Widowed'
}

export enum SmokingStatus {
  CURRENT = 'Current smoker',
  EX = 'Ex-Smoker',
  NON = 'Non-smoker'
}

export interface Company {
  id: string;
  name: string;
  ssmNumber: string;
  contactNumber: string;
  address: string;
  workerCount: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  companyId?: string;
}

export interface Worker {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  age: number;
  address: string;
  icPassport: string;
  gender: string;
  maritalStatus: MaritalStatus;
  noOfChildren: number;
  ethnicity: Ethnicity;
  ethnicityOthers?: string;
  isMalaysian: boolean;
  jobRole: string;
  hazards: Hazard[];
}

export enum Symptom {
  FEVER = 'Fever',
  COUGH = 'Cough',
  FATIGUE = 'Fatigue',
  BREATHLESSNESS = 'Shortness of breath',
  BODY_ACHE = 'Muscle aches',
  HEADACHE = 'Headache',
  SORE_THROAT = 'Sore throat',
  NAUSEA = 'Nausea',
  RASH = 'Skin Rash'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface PatientRecord {
  id: string;
  timestamp: string;
  visitDate: string;
  patientName: string;
  contactInfo: string;
  age: number;
  gender: string;
  temperature: number;
  heartRate: number;
  oxygenLevel: number;
  symptoms: Symptom[];
  severity: Severity;
  notes: string;
  outcome?: Outcome;
  companyName?: string;
  
  // External uploaded report
  externalReport?: {
    fileName: string;
    fileUrl: string;
    uploadDate: string;
  };

  // Surveillance fields
  medicalHistory?: {
    hasDisease: string;
    diseaseDetails: string;
    onMedication: string;
    medicationDetails: string;
    hospitalized: string;
    hospitalDetails: string;
  };
  personalHistory?: {
    smoking: SmokingStatus;
    smokingYears: string;
    smokingQty: string;
    vaping: string;
    vapingYears: string;
    alcohol: string;
    alcoholFrequency: string;
    socialNotes: string;
  };
  familyOtherHistory?: {
    familyHistory: string;
    otherHistory: string;
  };
  occupationalHistory?: {
    jobTitle: string;
    companyName: string;
    durationEmployment: string;
    durationExposureCHTH: string;
    incidentExposure: string;
    incidentDetails: string;
  };
  trainingHistory?: {
    safeHandling: { status: string; notes: string };
    recognizeSigns: { status: string; notes: string };
    poisoningSigns: { status: string; notes: string };
    ppeUsage: { status: string; notes: string };
    usePPEWhenHandling: { status: string; notes: string };
  };

  // New examination sections
  physicalExam?: {
    anthropometry: {
      weight: string;
      height: string;
      bmi: string;
    };
    vitalSigns: {
      bloodPressure: string;
      pulseRate: string;
      respiratoryRate: string;
    };
    generalAppearance: string;
  };
  organSystems?: {
    cardiovascular: string;
    ent: string;
    eyes: string;
    gastrointestinal: string;
    haematology: string;
    kidney: string;
    liver: string;
    musculoskeletal: string;
    nervousCentral: string;
    nervousPeripheral: string;
    reproductive: string;
    skin: string;
    others: string;
  };
  targetOrganTest?: Array<{
    test: string;
    findings: string;
    comments: string;
  }>;
  biologicalMonitoring?: Array<{
    determinant: string;
    result: string;
  }>;

  // New Sections
  respiratorFitness?: {
    status: string;
    justification: string;
  };
  msConclusion?: {
    historyChemicalExposure: string;
    historyChemicalExposureNotes?: string;
    clinicalFindings: string;
    clinicalFindingsNotes?: string;
    targetOrganResults: string;
    targetOrganNotes: string;
    beiResults: string;
    beiNotes: string;
    pregnancyStatus: string;
    fitnessToWork: string;
  };

  // Step 13
  recommendation?: {
    notesToEmployer: string;
    ohdName: string;
    clinicName: string;
    mmcNo: string;
    doshNo: string;
    phone: string;
    email: string;
    date: string;
  };

  // Step 14
  summaryRecord?: {
    workerName: string;
    chemicalName: string;
    msDate: string;
    healthEffectsCHTH: string;
    targetOrgan: string;
    beiDeterminant: string;
    workRelatedness: string; // "Yes" | "No"
    conclusion: string; // "Fit" | "Unfit"
    mrpDate: string;
    ohdDoshReg: string;
  };
}
