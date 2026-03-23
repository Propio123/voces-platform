import express from "express";
import { callOpenRouter } from "../utils/openrouter.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const reply = await callOpenRouter([
      { role: "system", content: "Eres un asistente empático que ayuda a trabajadores a mejorar su situación laboral." },
      { role: "user", content: message },
    ]);
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error /chat:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
