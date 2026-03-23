import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

/**
 * Llama a OpenRouter con un prompt o con mensajes de chat.
 * @param {string|Array} input - Prompt simple o array de mensajes estilo ChatGPT.
 * @param {string} model - Modelo de IA a usar (por defecto llama-3.1-8b).
 * @returns {Promise<string>} - Texto de respuesta de la IA.
 */
export async function callOpenRouter(input, model = "meta-llama/llama-3.1-8b-instruct") {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("❌ No se encontró OPENROUTER_API_KEY en .env");
    throw new Error("Falta la API key de OpenRouter");
  }

  // Normalizamos la estructura de mensajes
  const messages = Array.isArray(input)
    ? input
    : [
        { role: "system", content: "Eres un asistente experto en economía laboral y desarrollo humano." },
        { role: "user", content: input },
      ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "HTTP-Referer": "http://localhost:8100", // URL del frontend
        "X-Title": "Voces Evaluador y Chat IA",
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    const data = await response.json();

    // Si hay error de OpenRouter
    if (!response.ok) {
      console.error("❌ Error en la API de OpenRouter:", data);
      const msg = data?.error?.message || "Error desconocido en OpenRouter";
      throw new Error(`OpenRouter request failed (${response.status}): ${msg}`);
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || "No se pudo obtener respuesta de la IA.";

  } catch (error) {
    console.error("🚨 Error en callOpenRouter:", error.message);
    throw new Error("Error al comunicarse con OpenRouter: " + error.message);
  }
}



