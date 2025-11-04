import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/purchases", auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const { rows } = await pool.query(
      `SELECT i.*, p.purchased_at FROM purchases p
             JOIN items i ON p.item_id = i.id
             WHERE p.user_id = $1
             ORDER BY p.purchased_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
