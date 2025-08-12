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

// import fs from "fs";
// import csv from "csv-parser";
// import bcrypt from "bcryptjs";
// import { connection } from "../db.js";

// /**
//  * Carga un CSV en la tabla indicada.
//  * @param {string} filePath - Ruta del archivo CSV
//  * @param {string} tableName - Nombre de la tabla destino
//  * @param {Array<string>} columns - Nombres de las columnas en orden
//  * @param {boolean} hashPassword - Si debe hashear la columna "password"
//  */
// async function loadCSV(filePath, tableName, columns, hashPassword = false) {
//   try {
//     // Verificar si la tabla ya tiene datos
//     const [rows] = await connection
//       .promise()
//       .query(`SELECT COUNT(*) AS count FROM ${tableName}`);

//     if (rows[0].count > 0) {
//       console.log(`⚠️ La tabla '${tableName}' ya tiene datos. No se cargará el CSV.`);
//       return;
//     }

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", async (row) => {
//         try {
//           const values = columns.map((col) => {
//             if (hashPassword && col === "password") {
//               return bcrypt.hashSync(row[col], 10);
//             }
//             return row[col];
//           });

//           const placeholders = columns.map(() => "?").join(",");
//           await connection
//             .promise()
//             .query(
//               `INSERT INTO ${tableName} (${columns.join(",")}) VALUES (${placeholders})`,
//               values
//             );
//         } catch (err) {
//           console.error(`Error insertando en ${tableName}:`, err);
//         }
//       })
//       .on("end", () => {
//         console.log(`📥 Datos CSV de ${tableName} cargados correctamente`);
//       });
//   } catch (err) {
//     console.error(`Error procesando ${tableName}:`, err);
//   }
// }

// // 🚀 Cargar varios CSV
// export async function loadAllCSVs() {
//   await loadCSV("src/data/usuarios.csv", "usuarios", ["nombre", "email", "password"], true);
//   await loadCSV("src/data/productos.csv", "productos", ["nombre", "precio"]);
//   await loadCSV("src/data/pedidos.csv", "pedidos", ["id_cliente", "fecha"]);
//   await loadCSV("src/data/detalle_pedidos.csv", "detalle_pedidos", ["id_pedido", "id_producto", "cantidad"]);
// }

