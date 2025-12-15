// Financial Types (BLU Standard)
export interface FinancialItem {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number;
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subcategory?: string;
}

export interface ArAgingBucket {
  range: '0-6 months' | '6-12 months' | '> 12 months';
  amount: number;
  provisionRate: number; // 0, 0.5, or 1.0
}

// FHIR R4 Simplified Types
export interface FHIRPatient {
  resourceType: 'Patient';
  id: string;
  name: Array<{ family: string; given: Array<string> }>;
  gender: string;
  birthDate: string;
  telecom?: Array<{ system: string; value: string }>;
}

export interface FHIREncounter {
  resourceType: 'Encounter';
  id: string;
  status: string;
  subject: { reference: string };
  period: { start: string; end?: string };
  reasonCode?: Array<{ text: string }>;
}

export interface PatientRecord {
  id: string;
  fhirData: FHIRPatient;
  encounters: FHIREncounter[];
  clinicalNotes: string[]; // Mocking unstructured data
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}