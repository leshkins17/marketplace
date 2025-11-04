import express from "express";
import { auth } from "../middleware/auth.js";
import { pool } from "../db.js";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";
import { upload } from "../middleware/upload.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const userRes = await pool.query(
      "SELECT id, login, email, balance, avatar FROM users WHERE id = $1",
      [req.user.id]
    );

    const cartRes = await pool.query(
      "SELECT * FROM cart_items WHERE user_id = $1",
      [req.user.id]
    );

    const itemRes = await pool.query(
      "SELECT title, price FROM items WHERE id = $1",
      [cartRes.rows.item_id]
    );

    res.json({
      user: userRes.rows[0],
      items: itemRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.put("/me", auth, upload.none(), async (req, res) => {
  try {
    const { login, email, password, avatar } = req.body;
    const userId = req.user.id;

    if (!login && !email && !password && !avatar) {
      return res.status(400).json({ message: "No fields to update" });
    }

    await pool.query(
      `UPDATE users SET 
         login = COALESCE($1, login),
         email = COALESCE($2, email),
         password = COALESCE($3, password),
         avatar = COALESCE($4, avatar)
       WHERE id = $5`,
      [login, email, password, avatar, userId]
    );

    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);
    const updatedUser = rows[0];
    const token = jwt.sign(updatedUser, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ user: updatedUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.user.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

router.post("/me/add-money", auth, async (req, res) => {
  const { amount } = req.body;
  try {
    await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [
      amount,
      req.user.id,
    ]);
    res.json({ message: "Balance updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

export default router;
