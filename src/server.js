import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { pool } from "./db.js";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.post("/api/postItem", upload.array("images", 5), async (req, res) => {
  console.log("req.files:", req.files);
  console.log("req.body:", req.body);

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

      const { data, error } = await supabase.storage
        .from("images")
        .upload(filename, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(filename);

      uploadedUrls.push(publicData.publicUrl);
    }

    const result = await pool.query(
      `INSERT INTO items
        (title, description, category, price, condition, location, images, author_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *`,
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
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req, res) => {
  res.send("Marketplace's server");
});

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.get("/template", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "template.html"));
});

app.get("/api/item/:id", async (req, res) => {
  const itemId = req.params.id;
  try {
    const result = await pool.query("SELECT * FROM items WHERE id = $1", [
      itemId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/item/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const itemId = req.params.id;

    const itemResult = await pool.query(
      "SELECT author_id FROM items WHERE id = $1",
      [itemId]
    );
    if (itemResult.rows.length === 0)
      return res.status(404).json({ error: "Item not found" });

    if (itemResult.rows[0].author_id !== decoded.id)
      return res
        .status(403)
        .json({ error: "Forbidden: You cannot delete this item" });

    await pool.query("DELETE FROM items WHERE id = $1", [itemId]);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/item/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, description, condition, location } = req.body;
  const userId = req.user.id;

  const { rows } = await pool.query(
    "SELECT author_id FROM items WHERE id = $1",
    [id]
  );
  if (!rows.length) return res.status(404).send("Item not found");
  if (rows[0].author_id !== userId) return res.status(403).send("Unauthorized");

  await pool.query(
    "UPDATE items SET title=$1, price=$2, description=$3, condition=$4, location=$5 WHERE id=$6",
    [title, price, description, condition, location, id]
  );

  res.sendStatus(200);
});

app.get("/api/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/home", async (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "home.html"));
});

app.get("/api/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      "SELECT id, login, email FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    res.json({ decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

app.get("/market", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "market.html"));
});

app.get("/post", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "post.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "about.html"));
});

app.post("/api/signup", async (req, res) => {
  const { login, email, password } = req.body;
  try {
    const troubleshoot = await pool.query(
      "SELECT login, email FROM users WHERE login = $1 OR email = $2",
      [login, email]
    );

    if (troubleshoot.rows.length > 0) {
      const row = troubleshoot.rows[0];

      if (row.login === login && row.email === email) {
        return res
          .status(400)
          .json({ error: "User with similar login and email already exists" });
      } else if (row.email === email) {
        return res
          .status(400)
          .json({ error: "User with similar email already exists" });
      } else if (row.login === login) {
        return res
          .status(400)
          .json({ error: "User with similar login already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (login, email, password) VALUES ($1, $2, $3) RETURNING id, login, email",
      [login, email, hashedPassword]
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

app.post("/api/signin", async (req, res) => {
  const { login, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE login = $1", [
      login,
    ]);
    if (result.rows.length === 0)
      return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, login: user.login },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({ message: "Signed in successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at https://marketplace-4d4t.onrender.com`);
});
