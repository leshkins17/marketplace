import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { login, email, password } = req.body;
  try {
    const existing = await pool.query(
      "SELECT login, email FROM users WHERE login = $1 OR email = $2",
      [login, email]
    );

    if (existing.rows.length > 0) {
      const row = existing.rows[0];
      if (row.login === login && row.email === email)
        return res
          .status(400)
          .json({ error: "User with same login and email exists" });
      if (row.login === login)
        return res.status(400).json({ error: "User with same login exists" });
      if (row.email === email)
        return res.status(400).json({ error: "User with same email exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (login, email, password) VALUES ($1, $2, $3) RETURNING id, login, email",
      [login, email, hashed]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { login, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [
      login,
    ]);
    if (!result.rows.length)
      return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, login: user.login },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.json({ message: "Signed in successfully", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
