import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Marketplace's server");
});

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
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

    res.json(result.rows[0]);
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

app.post("/signup", async (req, res) => {
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

app.post("/signin", async (req, res) => {
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
