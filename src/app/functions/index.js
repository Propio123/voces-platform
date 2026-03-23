// functions/index.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as functions from "firebase-functions";

const genAI = new GoogleGenerativeAI("AIzaSyC60r5DUV8YXMhlnNZ8m2Sj22kaL5d5UwA");

export const evaluateSalary = functions.https.onCall(async (data, context) => {
  const { occupation, hours, salary, location, education } = data;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analiza la siguiente situación laboral en Ecuador y compara con estándares internacionales:
- Ocupación: ${occupation}
- Horas semanales: ${hours}
- Salario mensual: ${salary} USD
- Ubicación: ${location}
- Nivel educativo o capacitación: ${education}

Responde en formato JSON con:
{
  "nivel_precariedad": "...",
  "comparacion_ecuador": "...",
  "comparacion_internacional": "...",
  "sugerencias_mejora": "..."
}
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
});
