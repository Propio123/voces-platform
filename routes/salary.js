import express from "express";
import { callOpenRouter } from "../utils/openrouter.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { job, hoursPerWeek, salary, country } = req.body;

  const prompt = `
Analiza si este salario es justo según los estándares en ${country}.
Trabajo: ${job}
Horas por semana: ${hoursPerWeek}
Sueldo mensual: ${salary} USD.
Compara con el promedio local e internacional.
Indica si hay señales de explotación o precariedad laboral,
y recomienda mejoras realistas.
`;

  try {
    const analysis = await callOpenRouter(prompt);
    res.json({ analysis });
  } catch (error) {
    console.error("❌ Error /evaluate-salary:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

