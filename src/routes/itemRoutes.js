import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { upload } from "../middleware/upload.js";
import { supabase } from "../config/supabase.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/postItem", upload.array("images", 5), async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const author_id = decoded.id;
    const { title, description, category, price, condition, location } =
      req.body;
    const uploadedUrls = [];

    for (const file of req.files) {
      const filename = `${Date.now()}-${author_id}-${file.originalname}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });
      if (error) throw error;

      const { data } = supabase.storage.from("images").getPublicUrl(filename);
      uploadedUrls.push(data.publicUrl);
    }

    const result = await pool.query(
      `INSERT INTO items (title, description, category, price, condition, location, images, author_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [
        title,
        description,
        category,
        price,
        condition,
        location,
        uploadedUrls,
        author_id,
      ]
    );

    res
      .status(201)
      .json({ message: "Item posted successfully", item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/items", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/item/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Item not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/item/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Item not found" });

    const item = result.rows[0];
    if (item.author_id !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/item/:id", auth, upload.array("images", 5), async (req, res) => {
  const { id } = req.params;
  try {
    const itemRes = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
    if (!itemRes.rows.length)
      return res.status(404).json({ error: "Item not found" });

    const item = itemRes.rows[0];
    if (item.author_id !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    const { title, description, category, price, condition, location } =
      req.body;
    let uploadedUrls = item.images;

    if (req.files && req.files.length > 0) {
      uploadedUrls = [];
      for (const file of req.files) {
        const filename = `${Date.now()}-${req.user.id}-${file.originalname}`;
        const { error } = await supabase.storage
          .from("images")
          .upload(filename, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
          });
        if (error) throw error;

        const { data } = supabase.storage.from("images").getPublicUrl(filename);
        uploadedUrls.push(data.publicUrl);
      }
    }

    const result = await pool.query(
      `UPDATE items SET title = $1, description = $2, category = $3, price = $4, condition = $5, location = $6, images = $7
            WHERE id = $8 RETURNING *`,
      [
        title,
        description,
        category,
        price,
        condition,
        location,
        uploadedUrls,
        id,
      ]
    );

    res.json({ message: "Item updated", item: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/item/:id/buy", auth, async (req, res) => {
  const itemId = req.params.id;

  try {
    const itemRes = await pool.query("SELECT * FROM items WHERE id = $1", [itemId]);
    const item = itemRes.rows[0];
    if (!item) return res.status(404).json({ error: "Item not found" });
    if (item.is_sold)
      return res.status(400).json({ error: "Item already sold" });

    const buyerRes = await pool.query(
      "SELECT balance FROM users WHERE id = $1",
      [req.user.id]
    );
    const buyerBalance = Number(buyerRes.rows[0].balance);

    if (buyerBalance < item.price)
      return res.status(400).json({ error: "Insufficient balance" });

    await pool.query("BEGIN");

    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [
      item.price,
      req.user.id,
    ]);

    await pool.query("UPDATE items SET is_sold = TRUE WHERE id = $1", [itemId]);

    await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [
      item.price,
      item.user_id,
    ]);

    await pool.query("DELETE FROM cart_items WHERE item_id = $1", [itemId]);

    await pool.query(
      "INSERT INTO purchases (user_id, item_id) VALUES ($1, $2)",
      [req.user.id, itemId]
    );

    await pool.query("COMMIT");

    res.json({ message: "Item purchased successfully" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Purchase failed" });
  }
});

export default router;
