import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { connection } from "../db.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  connection.query("SELECT id, nombre, email FROM usuarios", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

export default router;
