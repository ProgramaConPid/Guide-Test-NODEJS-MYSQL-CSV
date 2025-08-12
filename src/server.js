import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";
import { loadCSVtoDB } from "./utils/csvLoader.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "src", "views")));

// Rutas
app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);

// Configuración para subir CSV manualmente
const upload = multer({ dest: "src/data/" });
app.post("/upload-csv", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No se subió archivo");
  loadCSVtoDB(req.file.path);
  res.json({ message: "CSV cargado correctamente" });
});

// 🚀 Cargar CSV automáticamente al iniciar
const defaultCSV = path.join(process.cwd(), "src", "data", "usuarios.csv");

app.listen(PORT, async () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
  try {
    await loadCSVtoDB(defaultCSV);
    console.log("📥 Datos masivos cargados desde usuarios.csv");
  } catch (err) {
    console.error("❌ Error cargando CSV al inicio:", err.message);
  }
});
