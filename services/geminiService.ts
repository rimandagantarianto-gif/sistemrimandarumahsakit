import { GoogleGenAI } from "@google/genai";

export const generateClinicalSummary = async (apiKey: string, noteContent: string, task: 'summary' | 'soap') => {
  if (!apiKey) throw new Error("API Key is required");

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `
    ROLE: You are an expert Medical Administrative Assistant for a hospital.
    
    CRITICAL SAFETY CONSTRAINTS:
    1. DO NOT DIAGNOSE, prescribe, or offer medical advice.
    2. Your output is a DRAFT for documentation purposes only.
    3. If the input contains insufficient information, state that clearly.
    4. Maintain strict patient confidentiality principles (though this is a local simulation).
    5. Be objective and concise.
    
    TASK:
    ${task === 'summary' 
      ? "Create a concise 'After Visit Summary' for the patient based on the doctor's notes. Focus on instructions and next steps." 
      : "Structure the provided unstructured notes into a standard SOAP (Subjective, Objective, Assessment, Plan) format."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: noteContent,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2, // Low temperature for factual consistency
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary. Please check your API Key and connection.");
  }
};