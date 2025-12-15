import React, { useState } from 'react';
import { mockPatients } from '../services/mockData';
import { generateClinicalSummary } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // We assume this is available or just render text. 
// For this environment we will render text safely.

const ClinicalAssistant: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(mockPatients[0].id);
  const [notes, setNotes] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('gemini_api_key') || '');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<'summary' | 'soap'>('summary');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const selectedPatient = mockPatients.find(p => p.id === selectedPatientId);

  const handlePatientChange = (id: string) => {
    setSelectedPatientId(id);
    const patient = mockPatients.find(p => p.id === id);
    if (patient) {
      // Pre-fill with existing note for demo
      setNotes(patient.clinicalNotes[0] || '');
      setAiResponse(null);
    }
  };

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setShowKeyModal(false);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }
    
    setLoading(true);
    setAiResponse(null);
    
    try {
      // Construct context from FHIR data
      const context = `
      PATIENT CONTEXT:
      Name: ${selectedPatient?.fhirData.name[0].given.join(' ')} ${selectedPatient?.fhirData.name[0].family}
      Gender: ${selectedPatient?.fhirData.gender}
      BirthDate: ${selectedPatient?.fhirData.birthDate}
      
      DOCTOR NOTES:
      ${notes}
      `;

      const result = await generateClinicalSummary(apiKey, context, activeTask);
      setAiResponse(result);
    } catch (error) {
      alert("Error generating content. Please check API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex gap-6">
      {/* Left Column: Patient List & FHIR Data */}
      <div className="w-1/3 flex flex-col gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <i className="fas fa-users text-blue-500"></i> Patient List
          </h3>
          <div className="space-y-2">
            {mockPatients.map(p => (
              <button
                key={p.id}
                onClick={() => handlePatientChange(p.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedPatientId === p.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-medium text-slate-800">
                  {p.fhirData.name[0].given.join(' ')} {p.fhirData.name[0].family}
                </div>
                <div className="text-xs text-slate-500 flex justify-between mt-1">
                  <span>ID: {p.id}</span>
                  <span>{p.fhirData.birthDate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FHIR Raw Viewer */}
        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-700 flex-1 overflow-hidden flex flex-col">
          <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
             <span className="text-xs font-mono text-green-400">FHIR R4 Resource (JSON)</span>
             <span className="px-2 py-0.5 bg-green-900 text-green-300 text-[10px] rounded uppercase">Secure</span>
          </div>
          <div className="p-4 overflow-auto flex-1 custom-scrollbar">
            <pre className="text-xs font-mono text-slate-300">
              {JSON.stringify(selectedPatient?.fhirData, null, 2)}
            </pre>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-2">// Latest Encounter</p>
              <pre className="text-xs font-mono text-blue-300">
                {JSON.stringify(selectedPatient?.encounters[0], null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: AI Workbench */}
      <div className="w-2/3 flex flex-col gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">AI Documentation Assistant</h3>
                <p className="text-xs text-slate-500">Powered by Gemini MedLM</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTask('summary')}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activeTask === 'summary' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Discharge Summary
              </button>
              <button
                 onClick={() => setActiveTask('soap')}
                 className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  activeTask === 'soap' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                SOAP Format
              </button>
               <button
                 onClick={() => setShowKeyModal(true)}
                 className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                 title="Set API Key"
              >
                <i className="fas fa-key"></i>
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-6 overflow-hidden">
             {/* Clinical Note Input */}
            <div className="flex-1 flex flex-col min-h-0 mb-4">
                <label className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Clinical Notes / Dictation
                </label>
                <textarea
                  className="flex-1 w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm leading-relaxed font-mono bg-slate-50"
                  placeholder="Enter unstructured notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center mb-4">
               <p className="text-xs text-slate-400">
                 <i className="fas fa-shield-alt mr-1"></i>
                 Drafts must be reviewed by a licensed physician.
               </p>
               <button
                 onClick={handleGenerate}
                 disabled={loading || !notes}
                 className={`px-6 py-2 rounded-lg font-medium shadow-md transition-all flex items-center gap-2 ${
                   loading || !notes
                     ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                     : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                 }`}
               >
                 {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>}
                 {loading ? 'Processing...' : 'Generate Draft'}
               </button>
            </div>

            {/* AI Output Area */}
            {aiResponse && (
              <div className="flex-1 min-h-0 bg-blue-50 rounded-lg border border-blue-100 p-4 overflow-auto animate-fade-in">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">AI Generated Draft</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(aiResponse)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      <i className="fas fa-copy mr-1"></i> Copy
                    </button>
                 </div>
                 <div className="prose prose-sm prose-blue max-w-none text-slate-700 whitespace-pre-wrap font-sans text-sm">
                   {aiResponse}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Gemini API Key</h3>
            <p className="text-sm text-slate-500 mb-4">
              To use the AI features, please provide a valid Google Gemini API Key. 
              This is stored locally in your browser.
            </p>
            <input 
              type="password"
              placeholder="Paste API Key here..."
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              defaultValue={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSaveKey(apiKey)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                Save Key
              </button>
            </div>
            <p className="text-xs text-center mt-4 text-slate-400">
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline hover:text-blue-500">
                Get an API Key
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalAssistant;