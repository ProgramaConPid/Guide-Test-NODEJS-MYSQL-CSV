import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connection } from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query(
    "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, hashedPassword],
    (err) => {
      if (err) return res.status(400).json({ error: "Usuario ya existe" });
      res.json({ message: "Usuario registrado" });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query("SELECT * FROM usuarios WHERE email=?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: "Credenciales inválidas" });

    const user = results[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id, email: user.email }, "secret_key", { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Login exitoso" });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout exitoso" });
});

export default router;
