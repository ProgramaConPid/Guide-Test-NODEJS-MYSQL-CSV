import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { connection } from "../db.js";

const router = express.Router();

// 📌 Obtener todos los usuarios
router.get("/", verifyToken, (req, res) => {
  connection.query("SELECT id, nombre, email FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// 📌 Editar usuario
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ message: "Nombre y email son obligatorios" });
  }

  connection.query(
    "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?",
    [nombre, email, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario actualizado correctamente" });
    }
  );
});

// 📌 Eliminar usuario
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  connection.query(
    "DELETE FROM usuarios WHERE id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      res.json({ message: "Usuario eliminado correctamente" });
    }
  );
});

export default router;
