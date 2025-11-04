import express from "express";
import { pool } from "../db.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/cart", auth, async (req, res) => {
  const { item_id, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    await pool.query(
      `INSERT INTO cart_items (user_id, item_id)
             VALUES ($1, $2)`,
      [userId, item_id]
    );

    res.json({ success: true, message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

router.get("/cart", auth, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT ci.*, title, i.price, i.images
             FROM cart_items ci
             JOIN items i ON ci.item_id = i.id
             WHERE ci.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

router.delete("/cart/:itemId", auth, async (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  try {
    await pool.query(
      `DELETE FROM cart_items WHERE user_id = $1 AND item_id = $2`,
      [userId, itemId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

router.post("/cart/buy-all", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows: cartItems } = await pool.query(
      `SELECT i.id, i.price, i.user_id 
         FROM cart_items c
         JOIN items i ON c.item_id = i.id
         WHERE c.user_id = $1`,
      [userId]
    );

    if (cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const totalCost = cartItems.reduce((sum, item) => sum + item.price, 0);

    const { rows: userRows } = await pool.query(
      "SELECT balance FROM users WHERE id = $1",
      [userId]
    );
    const balance = userRows[0].balance;

    if (balance < totalCost)
      return res.status(400).json({ message: "Not enough balance" });

    await pool.query("BEGIN");

    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [
      totalCost,
      userId,
    ]);

    const payments = {};
    for (const item of cartItems) {
      payments[item.user_id] = (payments[item.user_id] || 0) + item.price;
    }

    for (const [authorId, amount] of Object.entries(payments)) {
      await pool.query(
        "UPDATE users SET balance = balance + $1 WHERE id = $2",
        [amount, authorId]
      );
    }

    for (const item of cartItems) {
      await pool.query("UPDATE items SET is_sold = TRUE WHERE id = $1", [
        item.id,
      ]);
      await pool.query(
        "INSERT INTO purchases (user_id, item_id) VALUES ($1, $2)",
        [userId, item.id]
      );
      await pool.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND item_id = $2",
        [userId, item.id]
      );
    }

    await pool.query("COMMIT");
    res.json({ message: "Purchase successful" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
