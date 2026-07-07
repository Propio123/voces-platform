// server.js
import dotenv from "dotenv";
dotenv.config();
console.log("🔑 OPENROUTER_API_KEY cargada:", process.env.OPENROUTER_API_KEY ? "✅ OK" : "❌ NO DEFINIDA");
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { readFileSync } from "fs";
import admin from "firebase-admin";
import salaryRoutes from "./routes/salary.js";
import chatRoutes from "./routes/chat.js";



// --- Inicializar Firebase Admin (serviceAccountKey.json en servidor) ---
// --- Inicializar Firebase Admin (Blindado para Local y Render) ---
// --- Inicializar Firebase Admin (Blindado contra variables vacías o no leídas) ---
let serviceAccount;

// Evaluamos que la variable exista y no esté vacía o como string "undefined"
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON && process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim() !== "") {
  console.log("🚀 Cargando Firebase Admin desde Variable de Entorno en producción...");
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  console.log("💻 Cargando Firebase Admin desde archivo local (Desarrollo)...");
  const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// --- Inicializar Express ---
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Exponer db para routes
app.locals.db = db;

// Rutas
app.use("/evaluate-salary", salaryRoutes);
app.use("/chat-advice", chatRoutes);

// Ruta de prueba
app.get("/", (req, res) => res.send("Server IA OK"));

// Arrancar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
