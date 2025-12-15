import { FinancialItem, PatientRecord, ArAgingBucket } from '../types';

// BLU Financial Data
export const initialBalanceSheet: FinancialItem[] = [
  // Assets
  { id: '1', name: 'Kas dan Setara Kas', currentValue: 1500000000, previousValue: 1200000000, category: 'asset', subcategory: 'Lancar' },
  { id: '2', name: 'Investasi Jangka Pendek (3-12 bln)', currentValue: 500000000, previousValue: 300000000, category: 'asset', subcategory: 'Lancar' },
  { id: '3', name: 'Piutang Pelayanan', currentValue: 800000000, previousValue: 750000000, category: 'asset', subcategory: 'Lancar' },
  { id: '4', name: 'Persediaan', currentValue: 400000000, previousValue: 420000000, category: 'asset', subcategory: 'Lancar' },
  { id: '5', name: 'Aset Tetap (Tanah & Bangunan)', currentValue: 12000000000, previousValue: 12200000000, category: 'asset', subcategory: 'Tetap' },
  { id: '6', name: 'Peralatan Medis', currentValue: 5000000000, previousValue: 4500000000, category: 'asset', subcategory: 'Tetap' },
  
  // Liabilities
  { id: '7', name: 'Utang Usaha', currentValue: 300000000, previousValue: 250000000, category: 'liability', subcategory: 'Jangka Pendek' },
  { id: '8', name: 'Utang Pegawai', currentValue: 150000000, previousValue: 140000000, category: 'liability', subcategory: 'Jangka Pendek' },
  
  // Equity
  { id: '9', name: 'Ekuitas Awal', currentValue: 19000000000, previousValue: 18500000000, category: 'equity' },
];

export const activityItems: FinancialItem[] = [
  // Revenue
  { id: 'r1', name: 'Pendapatan Jasa Layanan', currentValue: 4500000000, previousValue: 4100000000, category: 'revenue' },
  { id: 'r2', name: 'Pendapatan Hibah', currentValue: 200000000, previousValue: 100000000, category: 'revenue' },
  { id: 'r3', name: 'Pendapatan APBN/APBD', currentValue: 1000000000, previousValue: 1000000000, category: 'revenue' },
  
  // Expenses
  { id: 'e1', name: 'Beban Pegawai', currentValue: 2100000000, previousValue: 2000000000, category: 'expense' },
  { id: 'e2', name: 'Beban Persediaan (Obat/Bahan)', currentValue: 1200000000, previousValue: 1100000000, category: 'expense' },
  { id: 'e3', name: 'Beban Jasa Pelayanan', currentValue: 500000000, previousValue: 450000000, category: 'expense' },
  { id: 'e4', name: 'Beban Penyusutan', currentValue: 300000000, previousValue: 300000000, category: 'expense' },
];

export const arAgingData: ArAgingBucket[] = [
  { range: '0-6 months', amount: 600000000, provisionRate: 0 },
  { range: '6-12 months', amount: 150000000, provisionRate: 0.5 },
  { range: '> 12 months', amount: 50000000, provisionRate: 1.0 },
];

// Mock FHIR Patients
export const mockPatients: PatientRecord[] = [
  {
    id: 'p1',
    fhirData: {
      resourceType: 'Patient',
      id: 'p1',
      name: [{ family: 'Santoso', given: ['Budi'] }],
      gender: 'male',
      birthDate: '1980-05-15',
      telecom: [{ system: 'phone', value: '08123456789' }]
    },
    encounters: [
      {
        resourceType: 'Encounter',
        id: 'e1',
        status: 'finished',
        subject: { reference: 'Patient/p1' },
        period: { start: '2023-10-01T09:00:00Z', end: '2023-10-01T10:30:00Z' },
        reasonCode: [{ text: 'Hypertension follow-up' }]
      }
    ],
    clinicalNotes: [
      `Patient presents with complaints of persistent headache for 3 days. 
      BP: 150/95 mmHg. HR: 88 bpm. 
      Patient admits to missing medication for the last week due to travel. 
      Denies chest pain or shortness of breath. 
      Assessment: Uncontrolled hypertension likely secondary to non-compliance. 
      Plan: Resume Amlodipine 10mg daily. Monitor BP at home.`
    ]
  },
  {
    id: 'p2',
    fhirData: {
      resourceType: 'Patient',
      id: 'p2',
      name: [{ family: 'Wijaya', given: ['Siti', 'Aminah'] }],
      gender: 'female',
      birthDate: '1992-11-20',
      telecom: [{ system: 'email', value: 'siti.w@example.com' }]
    },
    encounters: [
      {
        resourceType: 'Encounter',
        id: 'e2',
        status: 'finished',
        subject: { reference: 'Patient/p2' },
        period: { start: '2023-10-05T14:00:00Z' },
        reasonCode: [{ text: 'Routine Checkup' }]
      }
    ],
    clinicalNotes: [
      `32yo Female, G1P0, presenting for routine prenatal checkup at 24 weeks.
      Fetal heart rate: 145 bpm. Fundal height matches gestational age.
      Patient reports mild ankle edema. Urine protein negative.
      Advised on diet and leg elevation.`
    ]
  }
];