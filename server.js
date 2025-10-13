const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

const pool = require("./db");

app.get("/", (req, res) => {
  res.send("Marketplace's server");
});

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/market", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "market.html"));
});

app.get("/post", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "post.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.post("/signup", async (req, res) => {
  const { login, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (login, email, password) VALUES ($1, $2, $3) RETURNING id, login, email",
      [login, email, hashedPassword]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
