import fs from "fs";
import csv from "csv-parser";
import bcrypt from "bcryptjs";
import { connection } from "../db.js";

export async function loadCSVtoDB(filePath) {
  try {
    // 1️⃣ Verificar si ya existen usuarios
    const [rows] = await connection.promise().query(
      "SELECT COUNT(*) AS count FROM usuarios"
    );

    if (rows[0].count > 0) {
      console.log("⚠️ La tabla 'usuarios' ya tiene datos. No se cargará el CSV.");
      return;
    }

    // 2️⃣ Leer el CSV e insertar datos
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        try {
          const hashedPassword = await bcrypt.hash(row.password, 10);
          await connection
            .promise()
            .query(
              "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
              [row.nombre, row.email, hashedPassword]
            );
        } catch (err) {
          console.error("Error insertando fila:", err);
        }
      })
      .on("end", () => {
        console.log("📥 Datos CSV cargados en la base de datos");
      });
  } catch (err) {
    console.error("Error al verificar datos existentes:", err);
  }
}
