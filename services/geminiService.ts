
import { GoogleGenAI, Type } from "@google/genai";
import { PatientRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSurveillanceData = async (records: PatientRecord[]) => {
  const dataSummary = records.map(r => ({
    age: r.age,
    temp: r.temperature,
    ox: r.oxygenLevel,
    symptoms: r.symptoms,
    severity: r.severity
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following medical surveillance data for a clinic and identify any potential public health risks, outbreaks, or concerning trends. Provide a structured response. Data: ${JSON.stringify(dataSummary)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A brief summary of the current health landscape." },
          riskLevel: { type: Type.STRING, enum: ["Low", "Moderate", "High", "Critical"], description: "Overall public health risk level." },
          findings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                concernLevel: { type: Type.STRING }
              }
            }
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["summary", "riskLevel", "findings", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};
