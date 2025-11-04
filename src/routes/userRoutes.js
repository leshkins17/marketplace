import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, login, email, avatar FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!result.rows.length)
      return res.status(404).json({ error: "User not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

router.get("/users", async (_, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

export default router;
